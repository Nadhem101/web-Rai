const { ArticleTest, DetailArticle } = require('../models');
const { Op } = require('sequelize');

const clean = (v) => (v === undefined || v === null ? null : String(v).replace(/﻿/g, '').trim() || null);

// ── GET all (with optional search / filters) ───────────────
exports.findAll = async (req, res) => {
  try {
    const { q, programme_test, numero_testeur } = req.query;
    const where = {};

    if (q) {
      where[Op.or] = [
        { numero_article: { [Op.iLike]: `%${q}%` } },
        { designation:    { [Op.iLike]: `%${q}%` } },
      ];
    }
    if (programme_test) where.programme_test = programme_test;
    if (numero_testeur) where.numero_testeur = numero_testeur;

    const articles = await ArticleTest.findAll({
      where,
      include: [{ model: DetailArticle, as: 'details', order: [['id', 'ASC']] }],
      order: [['numero_article', 'ASC'], ['indice', 'ASC']],
    });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET one by id ──────────────────────────────────────────
exports.findOne = async (req, res) => {
  try {
    const article = await ArticleTest.findByPk(req.params.id, {
      include: [{ model: DetailArticle, as: 'details' }],
    });
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST create ────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { details = [], ...body } = req.body;

    const article = await ArticleTest.create({
      numero_article: clean(body.numero_article),
      indice:         clean(body.indice),
      designation:    clean(body.designation),
      numero_testeur: clean(body.numero_testeur),
      programme_test: clean(body.programme_test),
    });

    if (details.length) {
      await DetailArticle.bulkCreate(
        details.map((d) => ({
          id_article:    article.id,
          nappe_utilisee: clean(d.nappe_utilisee),
          emplacement:   clean(d.emplacement),
          interface:     clean(d.interface),
        }))
      );
    }

    const full = await ArticleTest.findByPk(article.id, {
      include: [{ model: DetailArticle, as: 'details' }],
    });
    res.status(201).json(full);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── PUT update ─────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const article = await ArticleTest.findByPk(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });

    const { details, ...body } = req.body;

    await article.update({
      numero_article: clean(body.numero_article) ?? article.numero_article,
      indice:         clean(body.indice),
      designation:    clean(body.designation),
      numero_testeur: clean(body.numero_testeur),
      programme_test: clean(body.programme_test),
    });

    if (details !== undefined) {
      await DetailArticle.destroy({ where: { id_article: article.id } });
      if (details.length) {
        await DetailArticle.bulkCreate(
          details.map((d) => ({
            id_article:    article.id,
            nappe_utilisee: clean(d.nappe_utilisee),
            emplacement:   clean(d.emplacement),
            interface:     clean(d.interface),
          }))
        );
      }
    }

    const full = await ArticleTest.findByPk(article.id, {
      include: [{ model: DetailArticle, as: 'details' }],
    });
    res.json(full);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── DELETE ─────────────────────────────────────────────────
exports.delete = async (req, res) => {
  try {
    const article = await ArticleTest.findByPk(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });
    await DetailArticle.destroy({ where: { id_article: article.id } });
    await article.destroy();
    res.json({ message: 'Article supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
