-- Seed outillages with clear designation + references
-- Run in Supabase SQL editor

DO $$
DECLARE v INT;
BEGIN

  -- 1. Gabarit de positionnement — 79.209.07
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Gabarit de positionnement', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES (v, '79.209.07', NULL, 0, NOW(), NOW());

  -- 2. Montage / Boîtier de positionnement — 79.209.09
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Montage / Boîtier de positionnement', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES (v, '79.209.09', NULL, 0, NOW(), NOW());

  -- 3. Gabarit d'assemblage général — 79.209.11
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Gabarit d''assemblage général', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES (v, '79.209.11', NULL, 0, NOW(), NOW());

  -- 4. Gabarit de positionnement vertical — 79.209.XX + 79.209.08 (2 parts)
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Gabarit de positionnement vertical', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES
    (v, '79.209.XX', NULL, 0, NOW(), NOW()),
    (v, '79.209.08', NULL, 1, NOW(), NOW());

  -- 5. Gabarit de montage à levier — 79.209.10
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Gabarit de montage à levier', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES (v, '79.209.10', NULL, 0, NOW(), NOW());

  -- 6. Gabarit d'assemblage (Culasse) — 79.209.33/01
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Gabarit d''assemblage', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES (v, '79.209.33/01', 'Culasse', 0, NOW(), NOW());

  -- 7. Gabarit d'assemblage (Volet) — 79.209.32/01
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Gabarit d''assemblage', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES (v, '79.209.32/01', 'Volet', 0, NOW(), NOW());

  -- 8. Gabarit de positionnement (Assemblage Moteur BA Alt) — 79.209.25/01
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Gabarit de positionnement', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES (v, '79.209.25/01', NULL, 0, NOW(), NOW());

  -- 9. Outillage pneumatique de mise en plat (BA Alternatif) — 79.209.27/01
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Outillage pneumatique de mise en plat', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES (v, '79.209.27/01', NULL, 0, NOW(), NOW());

  -- 10. Gabarit de positionnement (Assemblage Moteur BA Continu) — 79.209.21/01 + 79.209.21/02
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Gabarit de positionnement', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES
    (v, '79.209.21/01', NULL, 0, NOW(), NOW()),
    (v, '79.209.21/02', NULL, 1, NOW(), NOW());

  -- 11. Outillage pneumatique de mise en plat (BA Continu) — 79.209.2/01 + 79.209.2/02
  INSERT INTO outillages (designation, quantity, "createdAt", "updatedAt")
  VALUES ('Outillage pneumatique de mise en plat', 1, NOW(), NOW()) RETURNING id INTO v;
  INSERT INTO outillage_references (outillage_id, reference, label, ordre, "createdAt", "updatedAt")
  VALUES
    (v, '79.209.2/01', NULL, 0, NOW(), NOW()),
    (v, '79.209.2/02', NULL, 1, NOW(), NOW());

END $$;
