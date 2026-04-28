--
-- PostgreSQL database dump
--

\restrict 1OQgblrDgf43ljr6p99pbIqPYRzQEWALNdQJNlPL3dYQoTmazJZuYUhkdG8pGEP

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-04-28 10:50:31

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 894 (class 1247 OID 24578)
-- Name: enum_applicateur_maintenance_records_statut_verification; Type: TYPE; Schema: public; Owner: webrai_user
--

CREATE TYPE public.enum_applicateur_maintenance_records_statut_verification AS ENUM (
    'Conforme',
    'Non-conforme',
    'À reprendre'
);


ALTER TYPE public.enum_applicateur_maintenance_records_statut_verification OWNER TO webrai_user;

--
-- TOC entry 897 (class 1247 OID 24586)
-- Name: enum_applicateurs_statut; Type: TYPE; Schema: public; Owner: webrai_user
--

CREATE TYPE public.enum_applicateurs_statut AS ENUM (
    'En service',
    'Hors service',
    'À vérifier',
    'Vérification visuelle'
);


ALTER TYPE public.enum_applicateurs_statut OWNER TO webrai_user;

--
-- TOC entry 900 (class 1247 OID 24596)
-- Name: enum_ecme_etat_alerte; Type: TYPE; Schema: public; Owner: webrai_user
--

CREATE TYPE public.enum_ecme_etat_alerte AS ENUM (
    'VALABLE',
    'VERIFICATION',
    'EXEMPTE',
    'DECLASSE',
    'INCONNU'
);


ALTER TYPE public.enum_ecme_etat_alerte OWNER TO webrai_user;

--
-- TOC entry 903 (class 1247 OID 24608)
-- Name: enum_equipements_categorie; Type: TYPE; Schema: public; Owner: webrai_user
--

CREATE TYPE public.enum_equipements_categorie AS ENUM (
    'equipement',
    'pinces',
    'applicateurs'
);


ALTER TYPE public.enum_equipements_categorie OWNER TO webrai_user;

--
-- TOC entry 906 (class 1247 OID 24616)
-- Name: enum_equipements_statut; Type: TYPE; Schema: public; Owner: webrai_user
--

CREATE TYPE public.enum_equipements_statut AS ENUM (
    'En service',
    'Hors service',
    'En maintenance'
);


ALTER TYPE public.enum_equipements_statut OWNER TO webrai_user;

--
-- TOC entry 909 (class 1247 OID 24624)
-- Name: enum_maintenance_events_status; Type: TYPE; Schema: public; Owner: webrai_user
--

CREATE TYPE public.enum_maintenance_events_status AS ENUM (
    'done',
    'rescheduled'
);


ALTER TYPE public.enum_maintenance_events_status OWNER TO webrai_user;

--
-- TOC entry 954 (class 1247 OID 41567)
-- Name: enum_maintenance_sheets_status; Type: TYPE; Schema: public; Owner: webrai_user
--

CREATE TYPE public.enum_maintenance_sheets_status AS ENUM (
    'in_progress',
    'completed'
);


ALTER TYPE public.enum_maintenance_sheets_status OWNER TO webrai_user;

--
-- TOC entry 912 (class 1247 OID 24630)
-- Name: enum_pince_maintenance_records_statut_verification; Type: TYPE; Schema: public; Owner: webrai_user
--

CREATE TYPE public.enum_pince_maintenance_records_statut_verification AS ENUM (
    'Conforme',
    'Non-conforme',
    'À reprendre'
);


ALTER TYPE public.enum_pince_maintenance_records_statut_verification OWNER TO webrai_user;

--
-- TOC entry 915 (class 1247 OID 24638)
-- Name: enum_pinces_statut; Type: TYPE; Schema: public; Owner: webrai_user
--

CREATE TYPE public.enum_pinces_statut AS ENUM (
    'En service',
    'Hors service',
    'À vérifier',
    'Manque cosse',
    'Vérification visuelle'
);


ALTER TYPE public.enum_pinces_statut OWNER TO webrai_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 233 (class 1259 OID 24649)
-- Name: applicateur_maintenance_records; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.applicateur_maintenance_records (
    id integer NOT NULL,
    date_verification date NOT NULL,
    test_value_1 numeric(10,2),
    test_value_2 numeric(10,2),
    test_value_3 numeric(10,2),
    test_value_4 numeric(10,2),
    test_value_5 numeric(10,2),
    statut_verification character varying(50) DEFAULT 'À reprendre'::character varying,
    remarque text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    applicateur_variant_id integer
);


ALTER TABLE public.applicateur_maintenance_records OWNER TO webrai_user;

--
-- TOC entry 5720 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN applicateur_maintenance_records.test_value_1; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_maintenance_records.test_value_1 IS 'Premier essai';


--
-- TOC entry 5721 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN applicateur_maintenance_records.test_value_2; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_maintenance_records.test_value_2 IS 'Deuxième essai';


--
-- TOC entry 5722 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN applicateur_maintenance_records.test_value_3; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_maintenance_records.test_value_3 IS 'Troisième essai';


--
-- TOC entry 5723 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN applicateur_maintenance_records.test_value_4; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_maintenance_records.test_value_4 IS 'Quatrième essai';


--
-- TOC entry 5724 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN applicateur_maintenance_records.test_value_5; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_maintenance_records.test_value_5 IS 'Cinquième essai';


--
-- TOC entry 234 (class 1259 OID 24655)
-- Name: applicateur_maintenance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.applicateur_maintenance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applicateur_maintenance_records_id_seq OWNER TO webrai_user;

--
-- TOC entry 5725 (class 0 OID 0)
-- Dependencies: 234
-- Name: applicateur_maintenance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.applicateur_maintenance_records_id_seq OWNED BY public.applicateur_maintenance_records.id;


--
-- TOC entry 263 (class 1259 OID 43791)
-- Name: applicateur_thresholds; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.applicateur_thresholds (
    id integer NOT NULL,
    numero_outil character varying(100),
    reference_tec character varying(100),
    designation text,
    section_mm2 character varying(50),
    seuil_n character varying(100),
    longueur_denudage character varying(100),
    group_key character varying(300),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.applicateur_thresholds OWNER TO webrai_user;

--
-- TOC entry 5726 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN applicateur_thresholds.numero_outil; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_thresholds.numero_outil IS 'N° outil affiché dans le fichier source';


--
-- TOC entry 5727 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN applicateur_thresholds.reference_tec; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_thresholds.reference_tec IS 'Référence TEC';


--
-- TOC entry 5728 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN applicateur_thresholds.designation; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_thresholds.designation IS 'Désignation de l''applicateur';


--
-- TOC entry 5729 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN applicateur_thresholds.section_mm2; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_thresholds.section_mm2 IS 'Section en mm²';


--
-- TOC entry 5730 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN applicateur_thresholds.seuil_n; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_thresholds.seuil_n IS 'Seuil de sertissage en N';


--
-- TOC entry 5731 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN applicateur_thresholds.longueur_denudage; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_thresholds.longueur_denudage IS 'Longueur de dénudage';


--
-- TOC entry 5732 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN applicateur_thresholds.group_key; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_thresholds.group_key IS 'Clé de regroupement calculée à l''import';


--
-- TOC entry 262 (class 1259 OID 43790)
-- Name: applicateur_thresholds_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.applicateur_thresholds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applicateur_thresholds_id_seq OWNER TO webrai_user;

--
-- TOC entry 5733 (class 0 OID 0)
-- Dependencies: 262
-- Name: applicateur_thresholds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.applicateur_thresholds_id_seq OWNED BY public.applicateur_thresholds.id;


--
-- TOC entry 235 (class 1259 OID 24656)
-- Name: applicateur_variants; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.applicateur_variants (
    id integer NOT NULL,
    reference_constructeur character varying(100),
    reference_tec character varying(50),
    section_mm numeric(5,2),
    longueur_denudage character varying(20),
    valeur_traction character varying(50),
    affectation character varying(100),
    remarque text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    applicateur_id integer
);


ALTER TABLE public.applicateur_variants OWNER TO webrai_user;

--
-- TOC entry 5734 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN applicateur_variants.reference_constructeur; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_variants.reference_constructeur IS 'Référence constructeur';


--
-- TOC entry 5735 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN applicateur_variants.reference_tec; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_variants.reference_tec IS 'Référence TEC';


--
-- TOC entry 5736 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN applicateur_variants.section_mm; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_variants.section_mm IS 'Section en MM²';


--
-- TOC entry 5737 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN applicateur_variants.longueur_denudage; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_variants.longueur_denudage IS 'Longueur de dénudage';


--
-- TOC entry 5738 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN applicateur_variants.valeur_traction; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_variants.valeur_traction IS 'Valeur minimale requise';


--
-- TOC entry 5739 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN applicateur_variants.affectation; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateur_variants.affectation IS 'Affectation (zone de localisation)';


--
-- TOC entry 236 (class 1259 OID 24661)
-- Name: applicateur_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.applicateur_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applicateur_variants_id_seq OWNER TO webrai_user;

--
-- TOC entry 5740 (class 0 OID 0)
-- Dependencies: 236
-- Name: applicateur_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.applicateur_variants_id_seq OWNED BY public.applicateur_variants.id;


--
-- TOC entry 237 (class 1259 OID 24662)
-- Name: applicateurs; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.applicateurs (
    id integer NOT NULL,
    designation text,
    statut character varying(50) DEFAULT 'en service'::character varying,
    remarque text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    fabricant_id integer,
    numero_outil character varying(50) NOT NULL,
    site character varying(50),
    numero_serie character varying(100),
    constructeur_outil character varying(100)
);


ALTER TABLE public.applicateurs OWNER TO webrai_user;

--
-- TOC entry 5741 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN applicateurs.designation; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateurs.designation IS 'Désignation/Description de l''outil de sertissage';


--
-- TOC entry 5742 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN applicateurs.remarque; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateurs.remarque IS 'Notes et remarques';


--
-- TOC entry 5743 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN applicateurs.numero_outil; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateurs.numero_outil IS 'Numéro d''outil (A1, A2, A1-1, etc.)';


--
-- TOC entry 5744 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN applicateurs.site; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateurs.site IS 'Site (RAI)';


--
-- TOC entry 5745 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN applicateurs.numero_serie; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateurs.numero_serie IS 'Numéro de série';


--
-- TOC entry 5746 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN applicateurs.constructeur_outil; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.applicateurs.constructeur_outil IS 'Constructeur de l''outil (LINTECH, MECAL, etc.)';


--
-- TOC entry 238 (class 1259 OID 24668)
-- Name: applicateurs_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.applicateurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applicateurs_id_seq OWNER TO webrai_user;

--
-- TOC entry 5747 (class 0 OID 0)
-- Dependencies: 238
-- Name: applicateurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.applicateurs_id_seq OWNED BY public.applicateurs.id;


--
-- TOC entry 260 (class 1259 OID 41649)
-- Name: cosses; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.cosses (
    id integer NOT NULL,
    reference_constructeur character varying(120) NOT NULL,
    reference_tec character varying(120) NOT NULL,
    designation_tec text,
    outillage text,
    section_awg character varying(30),
    section_mm2 character varying(30),
    tenue_traction_n character varying(30),
    longueur_denudage_mm character varying(50),
    observation text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.cosses OWNER TO webrai_user;

--
-- TOC entry 261 (class 1259 OID 41654)
-- Name: cosses_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.cosses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cosses_id_seq OWNER TO webrai_user;

--
-- TOC entry 5748 (class 0 OID 0)
-- Dependencies: 261
-- Name: cosses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.cosses_id_seq OWNED BY public.cosses.id;


--
-- TOC entry 265 (class 1259 OID 54837)
-- Name: curative_maintenance_records; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.curative_maintenance_records (
    id integer NOT NULL,
    incident_date date NOT NULL,
    week_label character varying(20),
    intervenant character varying(120),
    zone_production character varying(120),
    equipement_code character varying(80),
    equipement_label character varying(255),
    request_time character varying(10),
    started_time character varying(10),
    finished_time character varying(10),
    description_panne text,
    response_minutes numeric(10,2),
    downtime_minutes numeric(10,2),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    equipement_id integer
);


ALTER TABLE public.curative_maintenance_records OWNER TO webrai_user;

--
-- TOC entry 5749 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN curative_maintenance_records.incident_date; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.curative_maintenance_records.incident_date IS 'Date de l''incident curatif';


--
-- TOC entry 5750 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN curative_maintenance_records.week_label; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.curative_maintenance_records.week_label IS 'Semaine au format KW xx';


--
-- TOC entry 5751 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN curative_maintenance_records.request_time; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.curative_maintenance_records.request_time IS 'Heure de demande';


--
-- TOC entry 5752 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN curative_maintenance_records.started_time; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.curative_maintenance_records.started_time IS 'Heure de début de l''intervention';


--
-- TOC entry 5753 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN curative_maintenance_records.finished_time; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.curative_maintenance_records.finished_time IS 'Heure de fin de l''intervention';


--
-- TOC entry 5754 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN curative_maintenance_records.response_minutes; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.curative_maintenance_records.response_minutes IS 'Délai entre la demande et le début d''intervention';


--
-- TOC entry 5755 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN curative_maintenance_records.downtime_minutes; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.curative_maintenance_records.downtime_minutes IS 'Durée d''arrêt liée à l''intervention';


--
-- TOC entry 264 (class 1259 OID 54836)
-- Name: curative_maintenance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.curative_maintenance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.curative_maintenance_records_id_seq OWNER TO webrai_user;

--
-- TOC entry 5756 (class 0 OID 0)
-- Dependencies: 264
-- Name: curative_maintenance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.curative_maintenance_records_id_seq OWNED BY public.curative_maintenance_records.id;


--
-- TOC entry 239 (class 1259 OID 24669)
-- Name: ecme_etat; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.ecme_etat (
    code character varying(20) NOT NULL,
    designation character varying(255) NOT NULL,
    marque character varying(100) DEFAULT ''::character varying,
    n_serie character varying(100) DEFAULT ''::character varying,
    affectation character varying(100) DEFAULT ''::character varying,
    necessite_verification boolean DEFAULT false,
    date_derniere_verification date,
    alerte public.enum_ecme_etat_alerte DEFAULT 'INCONNU'::public.enum_ecme_etat_alerte,
    date_prochaine_verification date,
    date_alerte date,
    remarques text DEFAULT ''::text,
    verif_type character varying(50) DEFAULT ''::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ecme_etat OWNER TO webrai_user;

--
-- TOC entry 240 (class 1259 OID 24681)
-- Name: ecme_interventions; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.ecme_interventions (
    id integer NOT NULL,
    ecme_code character varying(20) NOT NULL,
    date character varying(50) DEFAULT ''::character varying,
    nature text DEFAULT ''::text,
    resultat text DEFAULT ''::text,
    visa character varying(100) DEFAULT ''::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.ecme_interventions OWNER TO webrai_user;

--
-- TOC entry 241 (class 1259 OID 24690)
-- Name: ecme_interventions_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.ecme_interventions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ecme_interventions_id_seq OWNER TO webrai_user;

--
-- TOC entry 5757 (class 0 OID 0)
-- Dependencies: 241
-- Name: ecme_interventions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.ecme_interventions_id_seq OWNED BY public.ecme_interventions.id;


--
-- TOC entry 242 (class 1259 OID 24691)
-- Name: equipements; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.equipements (
    id integer NOT NULL,
    code_rai character varying(50) NOT NULL,
    designation character varying(200) NOT NULL,
    numero_serie character varying(100),
    date_acquisition date,
    remarque text,
    statut character varying(50) DEFAULT 'En service'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    zone_id integer,
    fabricant_id integer,
    categorie character varying(50) DEFAULT 'equipement'::character varying,
    pdr_details json
);


ALTER TABLE public.equipements OWNER TO webrai_user;

--
-- TOC entry 5758 (class 0 OID 0)
-- Dependencies: 242
-- Name: COLUMN equipements.categorie; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.equipements.categorie IS 'Catégorie de l''équipement: equipement (général), pdr (pièces de rechange), pinces (de sertissage), applicateurs (faisceaux), ou fer-et-bain';


--
-- TOC entry 243 (class 1259 OID 24698)
-- Name: equipements_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.equipements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipements_id_seq OWNER TO webrai_user;

--
-- TOC entry 5759 (class 0 OID 0)
-- Dependencies: 243
-- Name: equipements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.equipements_id_seq OWNED BY public.equipements.id;


--
-- TOC entry 244 (class 1259 OID 24699)
-- Name: fabricants; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.fabricants (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    pays character varying(50),
    contact character varying(100)
);


ALTER TABLE public.fabricants OWNER TO webrai_user;

--
-- TOC entry 245 (class 1259 OID 24702)
-- Name: fabricants_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.fabricants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fabricants_id_seq OWNER TO webrai_user;

--
-- TOC entry 5760 (class 0 OID 0)
-- Dependencies: 245
-- Name: fabricants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.fabricants_id_seq OWNED BY public.fabricants.id;


--
-- TOC entry 246 (class 1259 OID 24703)
-- Name: maintenance_events; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.maintenance_events (
    id integer NOT NULL,
    equip_code character varying(50) NOT NULL,
    interval_type character varying(10) NOT NULL,
    week integer NOT NULL,
    year integer NOT NULL,
    status public.enum_maintenance_events_status NOT NULL,
    new_week integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.maintenance_events OWNER TO webrai_user;

--
-- TOC entry 247 (class 1259 OID 24706)
-- Name: maintenance_events_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.maintenance_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_events_id_seq OWNER TO webrai_user;

--
-- TOC entry 5761 (class 0 OID 0)
-- Dependencies: 247
-- Name: maintenance_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.maintenance_events_id_seq OWNED BY public.maintenance_events.id;


--
-- TOC entry 257 (class 1259 OID 41572)
-- Name: maintenance_sheets; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.maintenance_sheets (
    id integer NOT NULL,
    machine_key character varying(120) NOT NULL,
    machine_label character varying(255) NOT NULL,
    reference character varying(100),
    template jsonb DEFAULT '{}'::jsonb NOT NULL,
    tasks jsonb DEFAULT '[]'::jsonb NOT NULL,
    spare_parts jsonb DEFAULT '[]'::jsonb NOT NULL,
    observations text,
    operator_matricule character varying(120),
    operator_signature character varying(255),
    started_at timestamp with time zone NOT NULL,
    finished_at timestamp with time zone,
    status public.enum_maintenance_sheets_status DEFAULT 'in_progress'::public.enum_maintenance_sheets_status NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.maintenance_sheets OWNER TO webrai_user;

--
-- TOC entry 256 (class 1259 OID 41571)
-- Name: maintenance_sheets_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.maintenance_sheets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_sheets_id_seq OWNER TO webrai_user;

--
-- TOC entry 5762 (class 0 OID 0)
-- Dependencies: 256
-- Name: maintenance_sheets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.maintenance_sheets_id_seq OWNED BY public.maintenance_sheets.id;


--
-- TOC entry 248 (class 1259 OID 24707)
-- Name: pince_maintenance_records; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.pince_maintenance_records (
    id integer NOT NULL,
    date_verification date,
    test_value_1 numeric(10,2),
    test_value_2 numeric(10,2),
    test_value_3 numeric(10,2),
    test_value_4 numeric(10,2),
    test_value_5 numeric(10,2),
    statut_verification character varying(50) DEFAULT 'À reprendre'::character varying,
    remarque text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    pince_variant_id integer
);


ALTER TABLE public.pince_maintenance_records OWNER TO webrai_user;

--
-- TOC entry 5763 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN pince_maintenance_records.test_value_1; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_maintenance_records.test_value_1 IS 'Premier essai de traction';


--
-- TOC entry 5764 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN pince_maintenance_records.test_value_2; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_maintenance_records.test_value_2 IS 'Deuxième essai';


--
-- TOC entry 5765 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN pince_maintenance_records.test_value_3; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_maintenance_records.test_value_3 IS 'Troisième essai';


--
-- TOC entry 5766 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN pince_maintenance_records.test_value_4; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_maintenance_records.test_value_4 IS 'Quatrième essai';


--
-- TOC entry 5767 (class 0 OID 0)
-- Dependencies: 248
-- Name: COLUMN pince_maintenance_records.test_value_5; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_maintenance_records.test_value_5 IS 'Cinquième essai';


--
-- TOC entry 249 (class 1259 OID 24713)
-- Name: pince_maintenance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.pince_maintenance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pince_maintenance_records_id_seq OWNER TO webrai_user;

--
-- TOC entry 5768 (class 0 OID 0)
-- Dependencies: 249
-- Name: pince_maintenance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.pince_maintenance_records_id_seq OWNED BY public.pince_maintenance_records.id;


--
-- TOC entry 259 (class 1259 OID 41633)
-- Name: pince_preventive_records; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.pince_preventive_records (
    id integer NOT NULL,
    date_controle date,
    numero_pince character varying(20),
    reference_more character varying(255),
    "position" character varying(100),
    cosse character varying(100),
    fil character varying(100),
    traction_minimale_n character varying(100),
    test_value_1 numeric(10,2),
    test_value_2 numeric(10,2),
    test_value_3 numeric(10,2),
    test_value_4 numeric(10,2),
    test_value_5 numeric(10,2),
    date_prochaine date,
    remarque text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.pince_preventive_records OWNER TO webrai_user;

--
-- TOC entry 5769 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN pince_preventive_records.date_controle; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_preventive_records.date_controle IS 'Date du controle preventive';


--
-- TOC entry 5770 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN pince_preventive_records.numero_pince; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_preventive_records.numero_pince IS 'Numero de pince';


--
-- TOC entry 5771 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN pince_preventive_records.reference_more; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_preventive_records.reference_more IS 'Colonne More du CSV source';


--
-- TOC entry 5772 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN pince_preventive_records.date_prochaine; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_preventive_records.date_prochaine IS 'Date de la prochaine maintenance preventive';


--
-- TOC entry 258 (class 1259 OID 41632)
-- Name: pince_preventive_records_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.pince_preventive_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pince_preventive_records_id_seq OWNER TO webrai_user;

--
-- TOC entry 5773 (class 0 OID 0)
-- Dependencies: 258
-- Name: pince_preventive_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.pince_preventive_records_id_seq OWNED BY public.pince_preventive_records.id;


--
-- TOC entry 250 (class 1259 OID 24714)
-- Name: pince_variants; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.pince_variants (
    id integer NOT NULL,
    reference_constructeur character varying(100),
    reference_tec character varying(50),
    section_mm numeric(5,2),
    section_awg character varying(20),
    longueur_denudage character varying(20),
    valeur_traction character varying(50),
    affectation character varying(100),
    remarque text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    pince_id integer
);


ALTER TABLE public.pince_variants OWNER TO webrai_user;

--
-- TOC entry 5774 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN pince_variants.reference_constructeur; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_variants.reference_constructeur IS 'Référence constructeur de la cosse (ex: 183024-1)';


--
-- TOC entry 5775 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN pince_variants.reference_tec; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_variants.reference_tec IS 'Référence TEC (ex: 923920000)';


--
-- TOC entry 5776 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN pince_variants.section_mm; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_variants.section_mm IS 'Section en MM² (0.35, 0.5, 0.75, 1, 1.5, 2, 2.5, etc.)';


--
-- TOC entry 5777 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN pince_variants.section_awg; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_variants.section_awg IS 'Section en AWG';


--
-- TOC entry 5778 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN pince_variants.longueur_denudage; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_variants.longueur_denudage IS 'Longueur de dénudage (ex: 3 à 3,5)';


--
-- TOC entry 5779 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN pince_variants.valeur_traction; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_variants.valeur_traction IS 'Valeur de traction minimale requise (ex: ≥ 115)';


--
-- TOC entry 5780 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN pince_variants.affectation; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_variants.affectation IS 'Affectation (zone de localisation)';


--
-- TOC entry 5781 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN pince_variants.remarque; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pince_variants.remarque IS 'Notes spécifiques à cette variante';


--
-- TOC entry 251 (class 1259 OID 24719)
-- Name: pince_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.pince_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pince_variants_id_seq OWNER TO webrai_user;

--
-- TOC entry 5782 (class 0 OID 0)
-- Dependencies: 251
-- Name: pince_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.pince_variants_id_seq OWNED BY public.pince_variants.id;


--
-- TOC entry 252 (class 1259 OID 24720)
-- Name: pinces; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.pinces (
    id integer NOT NULL,
    numero_pince character varying(10) NOT NULL,
    reference_pince character varying(100),
    date_verification date,
    statut character varying(50) DEFAULT 'À vérifier'::character varying,
    remarque text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    fabricant_id integer
);


ALTER TABLE public.pinces OWNER TO webrai_user;

--
-- TOC entry 5783 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN pinces.numero_pince; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pinces.numero_pince IS 'Numéro de pince (P01, P02, P3, etc.)';


--
-- TOC entry 5784 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN pinces.reference_pince; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pinces.reference_pince IS 'Référence de la pince (ex: 539 773-2A)';


--
-- TOC entry 5785 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN pinces.date_verification; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pinces.date_verification IS 'Dernière date de vérification';


--
-- TOC entry 5786 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN pinces.remarque; Type: COMMENT; Schema: public; Owner: webrai_user
--

COMMENT ON COLUMN public.pinces.remarque IS 'Notes et remarques (ex: manque cosse, cosse -50 pièces)';


--
-- TOC entry 253 (class 1259 OID 24726)
-- Name: pinces_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.pinces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pinces_id_seq OWNER TO webrai_user;

--
-- TOC entry 5787 (class 0 OID 0)
-- Dependencies: 253
-- Name: pinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.pinces_id_seq OWNED BY public.pinces.id;


--
-- TOC entry 254 (class 1259 OID 24727)
-- Name: zones; Type: TABLE; Schema: public; Owner: webrai_user
--

CREATE TABLE public.zones (
    id integer NOT NULL,
    nom_zone character varying(100) NOT NULL,
    localisation character varying(200)
);


ALTER TABLE public.zones OWNER TO webrai_user;

--
-- TOC entry 255 (class 1259 OID 24730)
-- Name: zones_id_seq; Type: SEQUENCE; Schema: public; Owner: webrai_user
--

CREATE SEQUENCE public.zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zones_id_seq OWNER TO webrai_user;

--
-- TOC entry 5788 (class 0 OID 0)
-- Dependencies: 255
-- Name: zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: webrai_user
--

ALTER SEQUENCE public.zones_id_seq OWNED BY public.zones.id;


--
-- TOC entry 4763 (class 2604 OID 41655)
-- Name: applicateur_maintenance_records id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateur_maintenance_records ALTER COLUMN id SET DEFAULT nextval('public.applicateur_maintenance_records_id_seq'::regclass);


--
-- TOC entry 4798 (class 2604 OID 43794)
-- Name: applicateur_thresholds id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateur_thresholds ALTER COLUMN id SET DEFAULT nextval('public.applicateur_thresholds_id_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 41656)
-- Name: applicateur_variants id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateur_variants ALTER COLUMN id SET DEFAULT nextval('public.applicateur_variants_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 41657)
-- Name: applicateurs id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateurs ALTER COLUMN id SET DEFAULT nextval('public.applicateurs_id_seq'::regclass);


--
-- TOC entry 4797 (class 2604 OID 41658)
-- Name: cosses id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.cosses ALTER COLUMN id SET DEFAULT nextval('public.cosses_id_seq'::regclass);


--
-- TOC entry 4799 (class 2604 OID 54840)
-- Name: curative_maintenance_records id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.curative_maintenance_records ALTER COLUMN id SET DEFAULT nextval('public.curative_maintenance_records_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 41659)
-- Name: ecme_interventions id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.ecme_interventions ALTER COLUMN id SET DEFAULT nextval('public.ecme_interventions_id_seq'::regclass);


--
-- TOC entry 4780 (class 2604 OID 41660)
-- Name: equipements id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements ALTER COLUMN id SET DEFAULT nextval('public.equipements_id_seq'::regclass);


--
-- TOC entry 4783 (class 2604 OID 41661)
-- Name: fabricants id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.fabricants ALTER COLUMN id SET DEFAULT nextval('public.fabricants_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 41662)
-- Name: maintenance_events id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.maintenance_events ALTER COLUMN id SET DEFAULT nextval('public.maintenance_events_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 41663)
-- Name: maintenance_sheets id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.maintenance_sheets ALTER COLUMN id SET DEFAULT nextval('public.maintenance_sheets_id_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 41664)
-- Name: pince_maintenance_records id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pince_maintenance_records ALTER COLUMN id SET DEFAULT nextval('public.pince_maintenance_records_id_seq'::regclass);


--
-- TOC entry 4796 (class 2604 OID 41665)
-- Name: pince_preventive_records id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pince_preventive_records ALTER COLUMN id SET DEFAULT nextval('public.pince_preventive_records_id_seq'::regclass);


--
-- TOC entry 4787 (class 2604 OID 41666)
-- Name: pince_variants id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pince_variants ALTER COLUMN id SET DEFAULT nextval('public.pince_variants_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 41667)
-- Name: pinces id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pinces ALTER COLUMN id SET DEFAULT nextval('public.pinces_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 41668)
-- Name: zones id; Type: DEFAULT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones ALTER COLUMN id SET DEFAULT nextval('public.zones_id_seq'::regclass);


--
-- TOC entry 5682 (class 0 OID 24649)
-- Dependencies: 233
-- Data for Name: applicateur_maintenance_records; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.applicateur_maintenance_records (id, date_verification, test_value_1, test_value_2, test_value_3, test_value_4, test_value_5, statut_verification, remarque, "createdAt", "updatedAt", applicateur_variant_id) FROM stdin;
\.


--
-- TOC entry 5712 (class 0 OID 43791)
-- Dependencies: 263
-- Data for Name: applicateur_thresholds; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.applicateur_thresholds (id, numero_outil, reference_tec, designation, section_mm2, seuil_n, longueur_denudage, group_key, "createdAt", "updatedAt") FROM stdin;
253	A1	270567021	COSS SUPERSEAL 0,3-0,5² FEM B	0.35	60	3 à 3,5	a1__270567021__coss superseal 0,3-0,5² fem b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
254	A1	270567021	COSS SUPERSEAL 0,3-0,5² FEM B	0.5	70	\N	a1__270567021__coss superseal 0,3-0,5² fem b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
255	A1	270567011	COSS SUPERSEAL 0,3-0,5² MAL B	0.35	60	3 à 3,5	a1__270567011__coss superseal 0,3-0,5² mal b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
256	A1	270567011	COSS SUPERSEAL 0,3-0,5² MAL B	0.5	70	\N	a1__270567011__coss superseal 0,3-0,5² mal b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
257	A2	923919100	COSS SUPERSEAL 0,75-1,5² FEM B	0.75	90	3 à 3,5	a2__923919100__coss superseal 0,75-1,5² fem b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
258	A2	923919100	COSS SUPERSEAL 0,75-1,5² FEM B	1	115	\N	a2__923919100__coss superseal 0,75-1,5² fem b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
259	A2	923919100	COSS SUPERSEAL 0,75-1,5² FEM B	1.5	155	\N	a2__923919100__coss superseal 0,75-1,5² fem b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
260	A2	923921000	COSS SUPERSEAL 0,75-1,5² MAL B	0.75	90	3 à 3,5	a2__923921000__coss superseal 0,75-1,5² mal b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
261	A2	923921000	COSS SUPERSEAL 0,75-1,5² MAL B	1	115	\N	a2__923921000__coss superseal 0,75-1,5² mal b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
262	A2	923921000	COSS SUPERSEAL 0,75-1,5² MAL B	1.5	155	\N	a2__923921000__coss superseal 0,75-1,5² mal b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
263	A3	270567111	COSS TRIM-TRIO 0,75-1,5² FEM V	1.5	150	6.35	a3__270567111__coss trim-trio 0,75-1,5² fem v	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
264	A3	270567111	COSS TRIM-TRIO 0,75-1,5² FEM V	0.8	90	\N	a3__270567111__coss trim-trio 0,75-1,5² fem v	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
265	A3	270567081	COSS TRIM-TRIO 0,75-1,5² MAL V	1.5	150	6.35	a3__270567081__coss trim-trio 0,75-1,5² mal v	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
266	A3	270567081	COSS TRIM-TRIO 0,75-1,5² MAL V	0.8	90	\N	a3__270567081__coss trim-trio 0,75-1,5² mal v	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
267	A4	270567570	COSS MAT-N-LOCK FEM 0.5-2² B	0.5	58	3,96 à 4,77	a4__270567570__coss mat-n-lock fem 0.5-2² b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
268	A4	270567570	COSS MAT-N-LOCK FEM 0.5-2² B	0.75	86.2	\N	a4__270567570__coss mat-n-lock fem 0.5-2² b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
269	A4	270567570	COSS MAT-N-LOCK FEM 0.5-2² B	1	113.4	\N	a4__270567570__coss mat-n-lock fem 0.5-2² b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
270	A4	270567570	COSS MAT-N-LOCK FEM 0.5-2² B	1.5	159.3	\N	a4__270567570__coss mat-n-lock fem 0.5-2² b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
271	A4	270567570	COSS MAT-N-LOCK FEM 0.5-2² B	2	212.4	\N	a4__270567570__coss mat-n-lock fem 0.5-2² b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
272	A6	270554240	CONTACT/A SERT./4809 MOLEX	0.05	13.3	4.5	a6__270554240__contact/a sert./4809 molex	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
273	A6	270554240	CONTACT/A SERT./4809 MOLEX	0.08	17.8	\N	a6__270554240__contact/a sert./4809 molex	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
274	A6	270554240	CONTACT/A SERT./4809 MOLEX	0.12	26.7	\N	a6__270554240__contact/a sert./4809 molex	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
275	A6	270554240	CONTACT/A SERT./4809 MOLEX	0.2	35.6	\N	a6__270554240__contact/a sert./4809 molex	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
276	A6	270554240	CONTACT/A SERT./4809 MOLEX	0.32	44.5	\N	a6__270554240__contact/a sert./4809 molex	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
277	A8	270607530	COSS MINI-FIT 1.5² FEM BANDE	1.5	88	3 à 3,5	a8__270607530__coss mini-fit 1.5² fem bande	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
278	A8	270607540	COSS MINI-FIT 1.5² MAL BANDE	1.5	88	3 à 3,5	a8__270607540__coss mini-fit 1.5² mal bande	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
279	A9	270607660	COSS 6,3 0,35-1,5² NUE F BAN	0.34	60	5 à 6	a9__270607660__coss 6,3 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
280	A9	270607660	COSS 6,3 0,35-1,5² NUE F BAN	0.5	95	\N	a9__270607660__coss 6,3 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
281	A9	270607660	COSS 6,3 0,35-1,5² NUE F BAN	0.6	100	\N	a9__270607660__coss 6,3 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
282	A9	270607660	COSS 6,3 0,35-1,5² NUE F BAN	0.75	120	\N	a9__270607660__coss 6,3 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
283	A9	270607660	COSS 6,3 0,35-1,5² NUE F BAN	1.00	140	\N	a9__270607660__coss 6,3 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
284	A9	270607660	COSS 6,3 0,35-1,5² NUE F BAN	1.50	190	\N	a9__270607660__coss 6,3 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
285	A10	270608760	COSS DEUTSCH T16 0.75-2² F BAN	2	111	3,81 - 5,08	a10__270608760__coss deutsch t16 0.75-2² f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
286	A10	270608760	COSS DEUTSCH T16 0.75-2² F BAN	0.75	\N	\N	a10__270608760__coss deutsch t16 0.75-2² f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
287	A10	270608560	COSS DEUTSCH T16 0.75-2² M BAN	2	112	3,81 - 5,09	a10__270608560__coss deutsch t16 0.75-2² m ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
288	A10	270608560	COSS DEUTSCH T16 0.75-2² M BAN	0.75	\N	\N	a10__270608560__coss deutsch t16 0.75-2² m ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
289	A11	270610410	COSS CPC 0,75-1,5mm² FEM BANDE	0.75	111	3,58 à 4,35	a11__270610410__coss cpc 0,75-1,5mm² fem bande	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
290	A11	270610410	COSS CPC 0,75-1,5mm² FEM BANDE	1	111	\N	a11__270610410__coss cpc 0,75-1,5mm² fem bande	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
291	A11	270610410	COSS CPC 0,75-1,5mm² FEM BANDE	1.5	178	\N	a11__270610410__coss cpc 0,75-1,5mm² fem bande	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
292	A11	270610400	COSS CPC 0.75-1.5mm² MAL BANDE	0.75	111	3,58 à 4,34	a11__270610400__coss cpc 0.75-1.5mm² mal bande	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
293	A11	270610400	COSS CPC 0.75-1.5mm² MAL BANDE	1	111	\N	a11__270610400__coss cpc 0.75-1.5mm² mal bande	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
294	A11	270610400	COSS CPC 0.75-1.5mm² MAL BANDE	1.5	178	\N	a11__270610400__coss cpc 0.75-1.5mm² mal bande	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
295	A12	270608830	COSS DEUTSCH T20 0.35-1.5² F B	1.5	89	3,81 - 5,08	a12__270608830__coss deutsch t20 0.35-1.5² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
296	A12	270608830	COSS DEUTSCH T20 0.35-1.5² F B	0.5	45	\N	a12__270608830__coss deutsch t20 0.35-1.5² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
297	A12	270609950	COSS DEUTSCH T20 0.35-1.5² M B	1.5	89	3,81 - 5,08	a12__270609950__coss deutsch t20 0.35-1.5² m b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
298	A12	270609950	COSS DEUTSCH T20 0.35-1.5² M B	0.5	45	\N	a12__270609950__coss deutsch t20 0.35-1.5² m b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
299	A13	270567042	COSS CINCH 0,5-0,8mm² FEM	0.5	62	4.5	a13__270567042__coss cinch 0,5-0,8mm² fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
300	A13	270567042	COSS CINCH 0,5-0,8mm² FEM	0.8	84	\N	a13__270567042__coss cinch 0,5-0,8mm² fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
301	A14	270608200	COSS HDSCS 1.5K 0.5-1mm² M B	0.5	≥60	3.8	a14__270608200__coss hdscs 1.5k 0.5-1mm² m b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
302	A14	270608200	COSS HDSCS 1.5K 0.5-1mm² M B	0.75	≥85	\N	a14__270608200__coss hdscs 1.5k 0.5-1mm² m b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
303	A14	270608200	COSS HDSCS 1.5K 0.5-1mm² M B	1	≥108	\N	a14__270608200__coss hdscs 1.5k 0.5-1mm² m b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
304	A15	270608260	COSS HDSCS 2.8 1-2.5mm² F B	1	≥108	5	a15__270608260__coss hdscs 2.8 1-2.5mm² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
305	A15	270608260	COSS HDSCS 2.8 1-2.5mm² F B	1.5	≥150	\N	a15__270608260__coss hdscs 2.8 1-2.5mm² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
306	A15	270608260	COSS HDSCS 2.8 1-2.5mm² F B	2.5	≥200	\N	a15__270608260__coss hdscs 2.8 1-2.5mm² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
307	A15	270612950	COSS HDSCS 2.8 1-2.5mm² F B ARGENT	1	≥108	4 à 6	a15__270612950__coss hdscs 2.8 1-2.5mm² f b argent	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
308	A15	270612950	COSS HDSCS 2.8 1-2.5mm² F B ARGENT	1.5	≥150	\N	a15__270612950__coss hdscs 2.8 1-2.5mm² f b argent	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
309	A15	270612950	COSS HDSCS 2.8 1-2.5mm² F B ARGENT	2.5	≥200	\N	a15__270612950__coss hdscs 2.8 1-2.5mm² f b argent	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
310	A16	270608210	COSS HDSCS 2.8 1.5-2.5mm² M B	1.5	≥150	5	a16__270608210__coss hdscs 2.8 1.5-2.5mm² m b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
311	A16	270608210	COSS HDSCS 2.8 1.5-2.5mm² M B	2.5	≥200	\N	a16__270608210__coss hdscs 2.8 1.5-2.5mm² m b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
312	A16	270612960	COSS HDSCS 2.8 1.5-2.5mm² M B ARGENT	1.5	≥150	4 à 6	a16__270612960__coss hdscs 2.8 1.5-2.5mm² m b argent	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
313	A16	270612960	COSS HDSCS 2.8 1.5-2.5mm² M B ARGENT	2.5	≥200	\N	a16__270612960__coss hdscs 2.8 1.5-2.5mm² m b argent	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
314	A17	270608000	COSS HDSCS 1.5K 0.5-1mm² F B	0.5	≥60	4	a17__270608000__coss hdscs 1.5k 0.5-1mm² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
315	A17	270608000	COSS HDSCS 1.5K 0.5-1mm² F B	0.75	≥85	\N	a17__270608000__coss hdscs 1.5k 0.5-1mm² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
316	A17	270608000	COSS HDSCS 1.5K 0.5-1mm² F B	1	≥108	\N	a17__270608000__coss hdscs 1.5k 0.5-1mm² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
317	A18	270610160	COSS DEUTSCH T16 0.5-1² F BAN	0.5	≥ 67	3,8 à 5,08	a18__270610160__coss deutsch t16 0.5-1² f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
318	A18	270610160	COSS DEUTSCH T16 0.5-1² F BAN	1	≥ 110	\N	a18__270610160__coss deutsch t16 0.5-1² f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
319	A18	270610170	COSS DEUTSCH T16 0.5-1² M BAN	0.5	≥ 67	3,8 à 5,08	a18__270610170__coss deutsch t16 0.5-1² m ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
320	A18	270610170	COSS DEUTSCH T16 0.5-1² M BAN	1	≥ 110	\N	a18__270610170__coss deutsch t16 0.5-1² m ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
321	A19	270611400	COSS JST SVF-61T-P2.0 FEM	0.5	≥65	5 à 5,5	a19__270611400__coss jst svf-61t-p2.0 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
322	A19	270611400	COSS JST SVF-61T-P2.0 FEM	0.75	≥80	\N	a19__270611400__coss jst svf-61t-p2.0 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
323	A19	270611400	COSS JST SVF-61T-P2.0 FEM	1	≥90	\N	a19__270611400__coss jst svf-61t-p2.0 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
324	A19	270611400	COSS JST SVF-61T-P2.0 FEM	1.25	≥100	\N	a19__270611400__coss jst svf-61t-p2.0 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
325	A19	270611400	COSS JST SVF-61T-P2.0 FEM	2	≥150	\N	a19__270611400__coss jst svf-61t-p2.0 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
326	A20	270611430	COSS JST SXH-001T-P0.6 FEM	0.12	19,6 ≤  x  ≥ 29,4	2,1 à 2,6	a20__270611430__coss jst sxh-001t-p0.6 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
327	A20	270611430	COSS JST SXH-001T-P0.6 FEM	0.22	58,8 ≤  x  ≥ 68,6	\N	a20__270611430__coss jst sxh-001t-p0.6 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
328	A20	270611430	COSS JST SXH-001T-P0.6 FEM	0.32	58,8 ≤  x  ≥ 68,7	\N	a20__270611430__coss jst sxh-001t-p0.6 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
329	A21	270611340	COSS JST SVF-81T-P2.0 FEM	3.5	≥150	5 à 5,5	a21__270611340__coss jst svf-81t-p2.0 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
330	A22	270600650	COSS AMPSEAL 0,5-1,5² F B ETAM	0.5	75	5 à 5,5	a22__270600650__coss ampseal 0,5-1,5² f b etam	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
331	A22	270600650	COSS AMPSEAL 0,5-1,5² F B ETAM	0.75	120	\N	a22__270600650__coss ampseal 0,5-1,5² f b etam	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
332	A22	270612540	COSS AMPSEAL 0,5-1,5² F B OR	1	140	\N	a22__270612540__coss ampseal 0,5-1,5² f b or	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
333	A22	270612540	COSS AMPSEAL 0,5-1,5² F B OR	1.5	200	\N	a22__270612540__coss ampseal 0,5-1,5² f b or	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
334	A23	270612730	COSS JPT L=21 0,5-1mm² F B	0.5	90	5 à 5,5	a23__270612730__coss jpt l=21 0,5-1mm² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
335	A23	270612730	COSS JPT L=21 0,5-1mm² F B	0.75	150	\N	a23__270612730__coss jpt l=21 0,5-1mm² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
336	A23	270612730	COSS JPT L=21 0,5-1mm² F B	1	180	\N	a23__270612730__coss jpt l=21 0,5-1mm² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
337	A24	\N	COSS MCON 0,5-0,75² F B	0.5	90	5 à 5,5	a24____coss mcon 0,5-0,75² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
338	A24	\N	COSS MCON 0,5-0,75² F B	0.75	145	\N	a24____coss mcon 0,5-0,75² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
339	A25	270614380	Outil sertissage cosses DELPHI METRI-PACK  \n0,5 à 1² FEMELLE	0.5	80	3,4 à 3,6	a25__270614380__outil sertissage cosses delphi metri-pack  \n0,5 a 1² femelle	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
340	A25	270614380	Outil sertissage cosses DELPHI METRI-PACK  \n0,5 à 1² FEMELLE	1	160	\N	a25__270614380__outil sertissage cosses delphi metri-pack  \n0,5 a 1² femelle	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
341	A26	270600460	Outil sertissage cosses DELPHI WHAETER-PACK  \n0,5 à 0,8² MALE	0.5	80	5.5	a26__270600460__outil sertissage cosses delphi whaeter-pack  \n0,5 a 0,8² male	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
342	A26	270600460	Outil sertissage cosses DELPHI WHAETER-PACK  \n0,5 à 0,8² MALE	0.75	85	\N	a26__270600460__outil sertissage cosses delphi whaeter-pack  \n0,5 a 0,8² male	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
343	A27	270615860	Outil sertissage cosses JAE MX34 0.5-0.75² FEM	0.5	70	4,3 à 3	a27__270615860__outil sertissage cosses jae mx34 0.5-0.75² fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
344	A27	270615860	Outil sertissage cosses JAE MX34 0.5-0.75² FEM	0.75	100	\N	a27__270615860__outil sertissage cosses jae mx34 0.5-0.75² fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
345	A28	270609780	Outil sertissage cosses DIN 72585 T1,5 0,5-1mm²	0.5	≥60	4.5	a28__270609780__outil sertissage cosses din 72585 t1,5 0,5-1mm²	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
346	A28	270609770	Outil sertissage cosses DIN 72585 T1,5 0,5-1mm²	0.75	≥80	\N	a28__270609770__outil sertissage cosses din 72585 t1,5 0,5-1mm²	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
347	A28	270609770	Outil sertissage cosses DIN 72585 T1,5 0,5-1mm²	1	≥100	\N	a28__270609770__outil sertissage cosses din 72585 t1,5 0,5-1mm²	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
348	A29	270567043	Outil sertissage cosses CINCH 0,8-2mm² FEM	1	120	4,05 à 4,65	a29__270567043__outil sertissage cosses cinch 0,8-2mm² fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
349	A29	270567043	Outil sertissage cosses CINCH 0,8-2mm² FEM	1.5	>165	\N	a29__270567043__outil sertissage cosses cinch 0,8-2mm² fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
350	A29	270567043	Outil sertissage cosses CINCH 0,8-2mm² FEM	2	>220	\N	a29__270567043__outil sertissage cosses cinch 0,8-2mm² fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
351	A30	270610660	Outil sertissage cosses DEUTSH en bande T16 1 à 2,5mm²	1.5	111	4,5 à 5,72	a30__270610660__outil sertissage cosses deutsh en bande t16 1 a 2,5mm²	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
352	A30	270610660	Outil sertissage cosses DEUTSH en bande T16 1 à 2,5mm²	2	155	\N	a30__270610660__outil sertissage cosses deutsh en bande t16 1 a 2,5mm²	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
353	A30	270610680	Outil sertissage cosses DEUTSH en bande T16 1 à 2,5mm²	2.5	185	\N	a30__270610680__outil sertissage cosses deutsh en bande t16 1 a 2,5mm²	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
354	A31	270621880	Outil sertissage cosses TYCO AWG 24-30 FEM	0.05	7.8	1,9 à 2,5	a31__270621880__outil sertissage cosses tyco awg 24-30 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
355	A31	270621880	Outil sertissage cosses TYCO AWG 24-30 FEM	0.08	9.8	\N	a31__270621880__outil sertissage cosses tyco awg 24-30 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
356	A31	270621880	Outil sertissage cosses TYCO AWG 24-30 FEM	0.14	19.6	\N	a31__270621880__outil sertissage cosses tyco awg 24-30 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
357	A31	270621880	Outil sertissage cosses TYCO AWG 24-30 FEM	0.22	29.4	\N	a31__270621880__outil sertissage cosses tyco awg 24-30 fem	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
358	A32	270612020	Outil sertissage cosses AMPH RT T16 0.35-0.5² M	0.35	35.5	4	a32__270612020__outil sertissage cosses amph rt t16 0.35-0.5² m	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
359	A32	270612020	Outil sertissage cosses AMPH RT T16 0.35-0.5² M	0.5	57.8	\N	a32__270612020__outil sertissage cosses amph rt t16 0.35-0.5² m	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
360	A33	270612030	Outil sertissage cosses AMPH RT T16 0.75-1.5² M	0.75	89	4	a33__270612030__outil sertissage cosses amph rt t16 0.75-1.5² m	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
361	A33	270612030	Outil sertissage cosses AMPH RT T16 0.75-1.5² M	1.5	133.5	\N	a33__270612030__outil sertissage cosses amph rt t16 0.75-1.5² m	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
362	A34	270613280	Outil sertissage cosses SUPERSEAL1.0 0,5² B	0.5	88.2	5	a34__270613280__outil sertissage cosses superseal1.0 0,5² b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
363	A35	270613320	Outil sertissage cosses SUPERSEAL1.0 0.75-1.25² B	0.75	117.6	5	a35__270613320__outil sertissage cosses superseal1.0 0.75-1.25² b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
364	A35	270613320	Outil sertissage cosses SUPERSEAL1.0 0.75-1.25² B	0.85	127.4	\N	a35__270613320__outil sertissage cosses superseal1.0 0.75-1.25² b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
365	A35	270613320	Outil sertissage cosses SUPERSEAL1.0 0.75-1.25² B	1.25	176.4	\N	a35__270613320__outil sertissage cosses superseal1.0 0.75-1.25² b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
366	A36	270620390	Outil sertissage cosses 2,8 0,5-1,5² F B	0.5	95	4.1	a36__270620390__outil sertissage cosses 2,8 0,5-1,5² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
367	A36	270620390	Outil sertissage cosses 2,8 0,5-1,5² F B	0.75	120	\N	a36__270620390__outil sertissage cosses 2,8 0,5-1,5² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
368	A36	270620390	Outil sertissage cosses 2,8 0,5-1,5² F B	1	140	\N	a36__270620390__outil sertissage cosses 2,8 0,5-1,5² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
369	A36	270620390	Outil sertissage cosses 2,8 0,5-1,5² F B	1.5	170	\N	a36__270620390__outil sertissage cosses 2,8 0,5-1,5² f b	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
370	A37	270621840	Outil sertissage cosses 4,8 0,35-1,5² NUE F BAN	0.34	60	4.9	a37__270621840__outil sertissage cosses 4,8 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
371	A37	270621840	Outil sertissage cosses 4,8 0,35-1,5² NUE F BAN	0.5	95	\N	a37__270621840__outil sertissage cosses 4,8 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
372	A37	270621840	Outil sertissage cosses 4,8 0,35-1,5² NUE F BAN	0.75	120	\N	a37__270621840__outil sertissage cosses 4,8 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
373	A37	270621840	Outil sertissage cosses 4,8 0,35-1,5² NUE F BAN	1	140	\N	a37__270621840__outil sertissage cosses 4,8 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
374	A37	270621840	Outil sertissage cosses 4,8 0,35-1,5² NUE F BAN	1.5	170	\N	a37__270621840__outil sertissage cosses 4,8 0,35-1,5² nue f ban	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
375	PP3	270600600	machine de sertissage pour cosse Minifit	0.25	29.3	3,5 à 4,2	pp3__270600600__machine de sertissage pour cosse minifit	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
376	PP3	270600600	machine de sertissage pour cosse Minifit	0.34	39.1	\N	pp3__270600600__machine de sertissage pour cosse minifit	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
377	PP3	270614470	machine de sertissage pour cosse Minifit	0.5	58	\N	pp3__270614470__machine de sertissage pour cosse minifit	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
378	PP3	270614470	machine de sertissage pour cosse Minifit	0.75	88	\N	pp3__270614470__machine de sertissage pour cosse minifit	2026-04-22 14:10:56.198+01	2026-04-22 14:10:56.198+01
\.


--
-- TOC entry 5684 (class 0 OID 24656)
-- Dependencies: 235
-- Data for Name: applicateur_variants; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.applicateur_variants (id, reference_constructeur, reference_tec, section_mm, longueur_denudage, valeur_traction, affectation, remarque, "createdAt", "updatedAt", applicateur_id) FROM stdin;
118	282404-1	270567011	\N	\N	\N	\N	\N	2026-04-22 14:14:47.579+01	2026-04-22 14:14:47.579+01	161
119	282110-1	923919100	\N	\N	\N	\N	\N	2026-04-22 14:14:47.585+01	2026-04-22 14:14:47.585+01	162
120	282109-1	923921000	\N	\N	\N	\N	\N	2026-04-22 14:14:47.594+01	2026-04-22 14:14:47.594+01	163
121	SC16M-1S31	270567111	\N	\N	\N	\N	\N	2026-04-22 14:14:47.598+01	2026-04-22 14:14:47.598+01	164
122	SM16M-1S31	270567081	\N	\N	\N	\N	\N	2026-04-22 14:14:47.599+01	2026-04-22 14:14:47.599+01	164
123	926882-1	270567570	\N	\N	\N	\N	\N	2026-04-22 14:14:47.601+01	2026-04-22 14:14:47.601+01	165
124	08-70-1031	923922200	\N	\N	\N	\N	\N	2026-04-22 14:14:47.605+01	2026-04-22 14:14:47.605+01	166
125	08-50-0031	270554240	\N	\N	\N	\N	\N	2026-04-22 14:14:47.614+01	2026-04-22 14:14:47.614+01	167
126	68800113722		\N	\N	\N	\N	\N	2026-04-22 14:14:47.619+01	2026-04-22 14:14:47.619+01	168
127	39-00-0077	270607530	\N	\N	\N	\N	\N	2026-04-22 14:14:47.622+01	2026-04-22 14:14:47.622+01	169
128	39-00-0081	270607540	\N	\N	\N	\N	\N	2026-04-22 14:14:47.627+01	2026-04-22 14:14:47.627+01	169
129	MEC7190766	270607660	\N	\N	\N	\N	\N	2026-04-22 14:14:47.637+01	2026-04-22 14:14:47.637+01	170
130	1062-16-0122	270608760	\N	\N	\N	\N	\N	2026-04-22 14:14:47.645+01	2026-04-22 14:14:47.645+01	171
131	1060-16-0122	270608560	\N	\N	\N	\N	\N	2026-04-22 14:14:47.649+01	2026-04-22 14:14:47.649+01	171
132	1-66100-9	270610410	\N	\N	\N	\N	\N	2026-04-22 14:14:47.652+01	2026-04-22 14:14:47.652+01	172
133	1-66098-8	270610400	\N	\N	\N	\N	\N	2026-04-22 14:14:47.661+01	2026-04-22 14:14:47.661+01	173
134	1062-20-0222	270608830	\N	\N	\N	\N	\N	2026-04-22 14:14:47.668+01	2026-04-22 14:14:47.668+01	174
135	1060-20-0222	270609950	\N	\N	\N	\N	\N	2026-04-22 14:14:47.669+01	2026-04-22 14:14:47.669+01	174
136	4250000872	270567042	\N	\N	\N	\N	\N	2026-04-22 14:14:47.671+01	2026-04-22 14:14:47.671+01	175
137	964269-2	270608200	\N	\N	\N	\N	\N	2026-04-22 14:14:47.677+01	2026-04-22 14:14:47.677+01	176
138	1-968857-1	270608260	\N	\N	\N	\N	\N	2026-04-22 14:14:47.687+01	2026-04-22 14:14:47.687+01	177
139	1-962916-1	270608210	\N	\N	\N	\N	\N	2026-04-22 14:14:47.694+01	2026-04-22 14:14:47.694+01	178
140	1241380-1	270608000	\N	\N	\N	\N	\N	2026-04-22 14:14:47.7+01	2026-04-22 14:14:47.7+01	179
141	1062-16-0622	270610160	\N	\N	\N	\N	\N	2026-04-22 14:14:47.701+01	2026-04-22 14:14:47.701+01	180
142	1060-16-0622	270610170	\N	\N	\N	\N	\N	2026-04-22 14:14:47.702+01	2026-04-22 14:14:47.702+01	180
143	SVF-61T-P2.0	270611400	\N	\N	\N	\N	\N	2026-04-22 14:14:47.704+01	2026-04-22 14:14:47.704+01	181
144	SXH-001T-P0.6	270611430	\N	\N	\N	\N	\N	2026-04-22 14:14:47.714+01	2026-04-22 14:14:47.714+01	182
145	SVF-81T-P2.0	270611340	\N	\N	\N	\N	\N	2026-04-22 14:14:47.721+01	2026-04-22 14:14:47.721+01	183
146	770520-1	270600650	\N	\N	\N	\N	\N	2026-04-22 14:14:47.733+01	2026-04-22 14:14:47.733+01	184
147	770520-3	270612540	\N	\N	\N	\N	\N	2026-04-22 14:14:47.736+01	2026-04-22 14:14:47.736+01	184
148	929939-1	270612730	\N	\N	\N	\N	\N	2026-04-22 14:14:47.739+01	2026-04-22 14:14:47.739+01	185
149	7-1452668-3	270620980	\N	\N	\N	\N	\N	2026-04-22 14:14:47.747+01	2026-04-22 14:14:47.747+01	186
150	15363934	270614380	\N	\N	\N	\N	\N	2026-04-22 14:14:47.75+01	2026-04-22 14:14:47.75+01	187
151	12089188	270600550	\N	\N	\N	\N	\N	2026-04-22 14:14:47.751+01	2026-04-22 14:14:47.751+01	188
152	12089040	270600460	\N	\N	\N	\N	\N	2026-04-22 14:14:47.752+01	2026-04-22 14:14:47.752+01	188
153	15344720		\N	\N	\N	\N	\N	2026-04-22 14:14:47.753+01	2026-04-22 14:14:47.753+01	188
154	M34S75C4F2	270615860	\N	\N	\N	\N	\N	2026-04-22 14:14:47.755+01	2026-04-22 14:14:47.755+01	189
155	1703013-1	270609780	\N	\N	\N	\N	\N	2026-04-22 14:14:47.766+01	2026-04-22 14:14:47.766+01	190
156	929989-1	270609770	\N	\N	\N	\N	\N	2026-04-22 14:14:47.767+01	2026-04-22 14:14:47.767+01	190
157	4250000873	270567043	\N	\N	\N	\N	\N	2026-04-22 14:14:47.768+01	2026-04-22 14:14:47.768+01	191
158	1060-16-1222	270610660	\N	\N	\N	\N	\N	2026-04-22 14:14:47.77+01	2026-04-22 14:14:47.77+01	192
159	1062-16-1222	270610680	\N	\N	\N	\N	\N	2026-04-22 14:14:47.771+01	2026-04-22 14:14:47.771+01	192
160	1735801-1	270621880	\N	\N	\N	\N	\N	2026-04-22 14:14:47.784+01	2026-04-22 14:14:47.784+01	193
161	SP20M2F	270612020	\N	\N	\N	\N	\N	2026-04-22 14:14:47.788+01	2026-04-22 14:14:47.788+01	194
162	SP16M1F	270612030	\N	\N	\N	\N	\N	2026-04-22 14:14:47.799+01	2026-04-22 14:14:47.799+01	195
163	3-1447221-4	270613280	\N	\N	\N	\N	\N	2026-04-22 14:14:47.802+01	2026-04-22 14:14:47.802+01	196
164	3-1447221-3	270613320	\N	\N	\N	\N	\N	2026-04-22 14:14:47.804+01	2026-04-22 14:14:47.804+01	197
165	00434-8DP	270620390	\N	\N	\N	\N	\N	2026-04-22 14:14:47.809+01	2026-04-22 14:14:47.809+01	198
166	00405-8DP	270621840	\N	\N	\N	\N	\N	2026-04-22 14:14:47.818+01	2026-04-22 14:14:47.818+01	199
167	1062-16-0122	270608760	\N	\N	\N	\N	\N	2026-04-22 14:14:47.82+01	2026-04-22 14:14:47.82+01	200
168	1060-16-0122	270608560	\N	\N	\N	\N	\N	2026-04-22 14:14:47.823+01	2026-04-22 14:14:47.823+01	200
169	1060-16-1222	270610660	\N	\N	\N	\N	\N	2026-04-22 14:14:47.839+01	2026-04-22 14:14:47.839+01	201
170	1062-16-1222	270610680	\N	\N	\N	\N	\N	2026-04-22 14:14:47.845+01	2026-04-22 14:14:47.845+01	201
171	4250000873	270567043	\N	\N	\N	\N	\N	2026-04-22 14:14:47.853+01	2026-04-22 14:14:47.853+01	202
172	MEC7190766	270607660	\N	\N	\N	\N	\N	2026-04-22 14:14:47.861+01	2026-04-22 14:14:47.861+01	203
173	4250000872	270567042	\N	\N	\N	\N	\N	2026-04-22 14:14:47.874+01	2026-04-22 14:14:47.874+01	204
174	1735801-1	270621880	\N	\N	\N	\N	\N	2026-04-22 14:14:47.885+01	2026-04-22 14:14:47.885+01	205
175	1062-16-0622	270610160	\N	\N	\N	\N	\N	2026-04-22 14:14:47.897+01	2026-04-22 14:14:47.897+01	206
176	1060-16-0622	270610170	\N	\N	\N	\N	\N	2026-04-22 14:14:47.9+01	2026-04-22 14:14:47.9+01	206
177	1062-16-0644	270612620	\N	\N	\N	\N	\N	2026-04-22 14:14:47.904+01	2026-04-22 14:14:47.904+01	206
178	43030-0001	270624420	\N	\N	\N	\N	\N	2026-04-22 14:14:47.918+01	2026-04-22 14:14:47.918+01	207
179	43031-0001	270624410	\N	\N	\N	\N	\N	2026-04-22 14:14:47.925+01	2026-04-22 14:14:47.925+01	207
180	3,5 à 4,2	270600600	\N	\N	\N	\N	\N	2026-04-22 14:14:47.933+01	2026-04-22 14:14:47.933+01	208
181		270614470	\N	\N	\N	\N	\N	2026-04-22 14:14:47.935+01	2026-04-22 14:14:47.935+01	208
182	170376-2	923908010	\N	\N	\N	\N	\N	2026-04-22 14:14:47.945+01	2026-04-22 14:14:47.945+01	209
183	39-00-0038	270600600	\N	\N	\N	\N	\N	2026-04-22 14:14:47.95+01	2026-04-22 14:14:47.95+01	210
184	39-00-0040	270614470	\N	\N	\N	\N	\N	2026-04-22 14:14:47.952+01	2026-04-22 14:14:47.952+01	210
185	08-50-0105		\N	\N	\N	\N	\N	2026-04-22 14:14:47.965+01	2026-04-22 14:14:47.965+01	211
117	282403-1	270567021	\N	\N	\N	\N	COSS SUPERSEAL 0,3-0,5² FEM B	2026-04-22 14:14:47.57+01	2026-04-24 14:51:11.603+01	160
\.


--
-- TOC entry 5686 (class 0 OID 24662)
-- Dependencies: 237
-- Data for Name: applicateurs; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.applicateurs (id, designation, statut, remarque, "createdAt", "updatedAt", fabricant_id, numero_outil, site, numero_serie, constructeur_outil) FROM stdin;
161		en service		2026-04-22 14:14:47.572+01	2026-04-22 14:14:47.572+01	\N	A1-1	RAI	L111589	MECAL
162	Outil sertissage cosse SUPERSEAL 0,75 à 1,5mm²	en service		2026-04-22 14:14:47.582+01	2026-04-22 14:14:47.582+01	\N	A2	RAI	LC00026	LINTECH
163		en service		2026-04-22 14:14:47.587+01	2026-04-22 14:14:47.587+01	\N	A2-1	RAI	L111588	MECAL
164	Outil sertissage cosse SOURIAU TRIM-TRIO	en service		2026-04-22 14:14:47.596+01	2026-04-22 14:14:47.596+01	\N	A3	RAI	LC00030	LINTECH
165	Outil sertissage cosse M-N-L	en service		2026-04-22 14:14:47.6+01	2026-04-22 14:14:47.6+01	\N	A4	RAI	L64172	MECAL
166	Outil sertissage cosse molex 5194	en service		2026-04-22 14:14:47.603+01	2026-04-22 14:14:47.603+01	\N	A5	RAI	LC00033	LINTECH
167	Outil sertissage cosse molex 08-50-0031	en service		2026-04-22 14:14:47.608+01	2026-04-22 14:14:47.608+01	\N	A6	RAI	L64173	MECAL
168	Outil sertissage cosse wurth	en service	Propriété RAI	2026-04-22 14:14:47.617+01	2026-04-22 14:14:47.617+01	\N	A7	RAI	L66287	MECAL
169	Outil sertissage cosse MINI-FIT 1,5mm²	en service		2026-04-22 14:14:47.62+01	2026-04-22 14:14:47.62+01	\N	A8	RAI	L76398	MECAL
170	Outil sertissage cosse 6,35	hors service	New kit Mq lame isolant	2026-04-22 14:14:47.635+01	2026-04-22 14:14:47.635+01	\N	A9	RAI	8430	MECATRACTION
171	Outil sertissage cosse DEUTSCH T16 0,75mm² à 2mm²	en service		2026-04-22 14:14:47.639+01	2026-04-22 14:14:47.639+01	\N	A10	RAI	L78444	MECAL
172	Outil sertissage cosse CPC  0,75 à 1,5mm²	en service		2026-04-22 14:14:47.65+01	2026-04-22 14:14:47.65+01	\N	A11	RAI	L80022	MECAL
173		en service		2026-04-22 14:14:47.654+01	2026-04-22 14:14:47.654+01	\N	A11-1	RAI	L111594	
174	Outil sertissage cosse DEUTSCH T20 0,35-1,5mm²	en service		2026-04-22 14:14:47.665+01	2026-04-22 14:14:47.665+01	\N	A12	RAI	L80027	MECAL
175	Outil sertissage cosse CINCH 0,5-0,8mm²	en service		2026-04-22 14:14:47.67+01	2026-04-22 14:14:47.67+01	\N	A13	RAI	L81485	MECAL
176	Outil sertissage  HDSCS 1.5K 0.5-1mm² Male	en service		2026-04-22 14:14:47.672+01	2026-04-22 14:14:47.672+01	\N	A14	RAI	L81555	MECAL
177	Outil sertissage  HDSCS 2,8 1-2,5mm² Femelle	en service		2026-04-22 14:14:47.684+01	2026-04-22 14:14:47.684+01	\N	A15	RAI	L81592	MECAL
178	Outil sertissage  HDSCS 2,8 1,5-2,5mm² Male	en service		2026-04-22 14:14:47.689+01	2026-04-22 14:14:47.689+01	\N	A16	RAI	L81594	MECAL
179	Outil sertissage  HDSCS 1,5K 0,5-1mm² Femelle	en service		2026-04-22 14:14:47.699+01	2026-04-22 14:14:47.699+01	\N	A17	RAI	L81596	MECAL
180	Outil sertissage cosses DEUTSCH en bande T16\n0,5mm² à 1mm²	en service		2026-04-22 14:14:47.701+01	2026-04-22 14:14:47.701+01	\N	A18	RAI	L83238	MECAL
181	Outil sertissage cosses JST  0,5 à 2mm² FEMELLE	en service		2026-04-22 14:14:47.703+01	2026-04-22 14:14:47.703+01	\N	A19	RAI	L76398	MECAL
182	Outil sertissage cosses JST 0,13 à 0,33²  FEMELLE	en service		2026-04-22 14:14:47.707+01	2026-04-22 14:14:47.707+01	\N	A20	RAI	L83251	MECAL
183	Outil sertissage cosses JST 0,13 à 0,33²  FEMELLE	en service		2026-04-22 14:14:47.718+01	2026-04-22 14:14:47.718+01	\N	A21	RAI	L83248	MECAL
184	Outil sertissage cosses AMPSEAL 0,5 à 1,5² FEMELLE	en service		2026-04-22 14:14:47.729+01	2026-04-22 14:14:47.729+01	\N	A22	RAI	L93605	MECAL
185	Outil sertissage cosses JPT 0,5 à 1² FEMELLE	en service		2026-04-22 14:14:47.737+01	2026-04-22 14:14:47.737+01	\N	A23	RAI	L93505	MECAL
186	Outil sertissage cosses MCON 0,5à 0,75² FEMELLE	en service		2026-04-22 14:14:47.742+01	2026-04-22 14:14:47.742+01	\N	A24	RAI	L93504	MECAL
187	Outil sertissage cosses DELPHI METRI-PACK  \n0,5 à 1² FEMELLE	hors service	N° ET106 Récup HA HARDELLET, (constructeur introuvable, plus possible d'avoir des PCS)	2026-04-22 14:14:47.749+01	2026-04-22 14:14:47.749+01	\N	A25	RAI	522,384,001	KRISTEN
188	Outil sertissage cosses DELPHI WHAETER-PACK  \n0,5 à 0,8² MALE	hors service	N° ET107 Récup HA HARDELLET, (constructeur introuvable, plus possible d'avoir des PCS)	2026-04-22 14:14:47.75+01	2026-04-22 14:14:47.75+01	\N	A26	RAI	522,385,001	KRISTEN
189	Outil sertissage cosses JAE MX34 0.5-0.75² FEM	en service		2026-04-22 14:14:47.753+01	2026-04-22 14:14:47.753+01	\N	A27	RAI	10525\n37-0-1538-00-0	SIROCCO
190	Outil sertissage cosses DIN 72585 T1,5 0,5-1mm²	en service		2026-04-22 14:14:47.76+01	2026-04-22 14:14:47.76+01	\N	A28	RAI	L111590	MECAL
191	Outil sertissage cosses CINCH 0,8-2mm² FEM	en service		2026-04-22 14:14:47.768+01	2026-04-22 14:14:47.768+01	\N	A29	RAI	L111592	MECAL
192	Outil sertissage cosses DEUTSH en bande T16 1 à 2,5mm²	en service		2026-04-22 14:14:47.769+01	2026-04-22 14:14:47.769+01	\N	A30	RAI	L111998	MECAL
193	Outil sertissage cosses TYCO AWG 24-30 FEM	en service		2026-04-22 14:14:47.775+01	2026-04-22 14:14:47.775+01	\N	A31	RAI	L117162	MECAL
194	Outil sertissage cosses AMPH RT T16 0.35-0.5² M	en service		2026-04-22 14:14:47.786+01	2026-04-22 14:14:47.786+01	\N	A32	RAI	118946	MECAL
195	Outil sertissage cosses AMPH RT T16 0.75-1.5² M	en service		2026-04-22 14:14:47.795+01	2026-04-22 14:14:47.795+01	\N	A33	RAI	L118962	MECAL
196	Outil sertissage cosses SUPERSEAL1.0 0,5² B	en service		2026-04-22 14:14:47.801+01	2026-04-22 14:14:47.801+01	\N	A34	RAI	L118951	MECAL
197	Outil sertissage cosses SUPERSEAL1.0 0.75-1.25² B	en service		2026-04-22 14:14:47.803+01	2026-04-22 14:14:47.803+01	\N	A35	RAI	L118965	MECAL
198	Outil sertissage cosses 2,8 0,5-1,5² F B	en service		2026-04-22 14:14:47.806+01	2026-04-22 14:14:47.806+01	\N	A36	RAI	9263	MECATRACTION
199	Outil sertissage cosses 4,8 0,35-1,5² NUE F BAN	en service		2026-04-22 14:14:47.816+01	2026-04-22 14:14:47.816+01	\N	A37	RAI	9262	MECATRACTION
200	Outil sertissage cosse DEUTSCH T16 0,75mm² à 2mm²	en service		2026-04-22 14:14:47.819+01	2026-04-22 14:14:47.819+01	\N	E467 + A38	RAI		WEIJONG
201	Outil sertissage cosses DEUTSH en bande T16 1 à 2,5mm²	en service		2026-04-22 14:14:47.834+01	2026-04-22 14:14:47.834+01	\N	E469 + A39	RAI		WEIJONG
202	Outil sertissage cosses CINCH 0,8-2mm² FEM	en service	PB PINCE	2026-04-22 14:14:47.85+01	2026-04-22 14:14:47.85+01	\N	E470 + A41	RAI		WEIJONG
203	Outil sertissage cosse 6,35	en service		2026-04-22 14:14:47.857+01	2026-04-22 14:14:47.857+01	\N	E468 + A43	RAI		WEIJONG
204	Outil sertissage cosse CINCH 0,5-0,8mm²	en service		2026-04-22 14:14:47.868+01	2026-04-22 14:14:47.868+01	\N	E471 + A40	RAI		WEIJONG
205	Outil sertissage cosses TYCO AWG 24-30 FEM	hors service	pb lame cuivre	2026-04-22 14:14:47.882+01	2026-04-22 14:14:47.882+01	\N	E472 + A42	RAI		WEIJONG
206	Outil sertissage cosses DEUTSCH en bande T16\n0,5mm² à 1mm²	en service		2026-04-22 14:14:47.891+01	2026-04-22 14:14:47.891+01	\N	E449 + A44	RAI		WEIJONG
207	Outil sertissage cosses Mico Fit 0,2-0,5²	en service		2026-04-22 14:14:47.91+01	2026-04-22 14:14:47.91+01	\N	A45	RAI	L129379	MECAL
208	Outil sertissage pour cosse Minifit	en service		2026-04-22 14:14:47.93+01	2026-04-22 14:14:47.93+01	\N	A46	RAI	L134921	MECAL
209	Outil sertissage BROCHE A.M.P 170376-2 0,12-0,177	en service		2026-04-22 14:14:47.937+01	2026-04-22 14:14:47.937+01	\N	PP3 / EQUIP 190	RAI	9339 L	KRISTEN
210	Outil sertissage cosse MINI-FIT 0,25-0,75²	en service	PB ENCLUME	2026-04-22 14:14:47.948+01	2026-04-22 14:14:47.948+01	\N	PP3 / EQUIP 450	RAI	10577 SL	KRISTEN
211		en service		2026-04-22 14:14:47.954+01	2026-04-22 14:14:47.954+01	\N	PP3 / EQUIP 385	RAI	10576 SL	KRISTEN
160	Outil sertissage cosse SUPERSEAL 0,3 à 0,5mm²	en service	\N	2026-04-22 14:14:47.553+01	2026-04-24 14:51:22.689+01	\N	A1	RAI	LC00022	LINTECH
\.


--
-- TOC entry 5709 (class 0 OID 41649)
-- Dependencies: 260
-- Data for Name: cosses; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.cosses (id, reference_constructeur, reference_tec, designation_tec, outillage, section_awg, section_mm2, tenue_traction_n, longueur_denudage_mm, observation, "createdAt", "updatedAt") FROM stdin;
1	CAR2PC68	270609270	CONN DEUTS CAR2PC68	P4 / P19	\N	6	≥ 650	12	cosses et connecteur font partie de la même référence	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
2	CAR2SC68	270609280	CONN DEUTS CAR2SC68	P4 / P19	\N	6	≥ 650	12	cosses et connecteur font partie de la même référence	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
3	CAR3PC68	270567101	CONN DEUTS CAR3PC68	P4 / P19	\N	6	≥ 650	12	cosses et connecteur font partie de la même référence	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
4	0151081-20-1G	923927200	CONTACT MALE REP V2 0.5-2.5mm²	P136 : Outils WA27F + Positionneur TGV202	\N	0.5	≥ 60	7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
5	0151081-20-1G	923927200	CONTACT MALE REP V2 0.5-2.5mm²	P136 : Outils WA27F + Positionneur TGV202	\N	0.75	???	7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
6	0151081-20-1G	923927200	CONTACT MALE REP V2 0.5-2.5mm²	P136 : Outils WA27F + Positionneur TGV202	\N	1	???	7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
7	0151081-20-1G	923927200	CONTACT MALE REP V2 0.5-2.5mm²	P136 : Outils WA27F + Positionneur TGV202	\N	1.5	???	7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
8	0151081-20-1G	923927200	CONTACT MALE REP V2 0.5-2.5mm²	P136 : Outils WA27F + Positionneur TGV202	\N	2.5	???	7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
9	962875-1	270626040	COSS µ TIMER 0,34-0,5² F B	P57 / E42 - E281	\N	0.34	≥ 50	3.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
10	962875-1	270626040	COSS µ TIMER 0,34-0,5² F B	P57 / E42 - E281	\N	0.5	≥ 60	3.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
11	962876-1	270611160	COSS µ TIMER 0,5-1² F B	A47 / P70 / E42 - E281	\N	0.5	≥ 60	3.8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
12	962876-1	270611160	COSS µ TIMER 0,5-1² F B	A47 / P70 / E42 - E281	\N	0.75	???	3.8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
13	962876-1	270611160	COSS µ TIMER 0,5-1² F B	A47 / P70 / E42 - E281	\N	1	≥ 100	3.8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
14	962943-1	270621130	COSS µ TIMER 0,5-1² F B sans joint	P131 / E281	\N	0.5	???	4 à 4,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
15	962943-1	270621130	COSS µ TIMER 0,5-1² F B sans joint	P131 / E281	\N	0.75	???	4 à 4,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
16	962943-1	270621130	COSS µ TIMER 0,5-1² F B sans joint	P131 / E281	\N	1	???	4 à 4,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
17	1703414-1	270625410	COSS µ TIMER 1,5² F B	???	\N	1.5	???	3.8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
18	MEC7190766	270607660	COSS 6,3 0,35-1,5² NUE F BAN	P9 - P48 - P100 / A9	\N	0.34	≥ 60	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
19	MEC7190766	270607660	COSS 6,3 0,35-1,5² NUE F BAN	P9 - P48 - P100 / A9	\N	0.5	≥ 95	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
20	MEC7190766	270607660	COSS 6,3 0,35-1,5² NUE F BAN	P9 - P48 - P100 / A9	\N	0.6	≥ 100	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
21	MEC7190766	270607660	COSS 6,3 0,35-1,5² NUE F BAN	P9 - P48 - P100 / A9	\N	0.75	≥ 120	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
22	MEC7190766	270607660	COSS 6,3 0,35-1,5² NUE F BAN	P9 - P48 - P100 / A9	\N	1.00	≥ 140	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
23	MEC7190766	270607660	COSS 6,3 0,35-1,5² NUE F BAN	P9 - P48 - P100 / A9	\N	1.50	≥ 150	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
24	7116-2090	270619680	COSS 6.3 0,5-2² F LANG YASAKI	???	\N	0.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
25	7116-2090	270619680	COSS 6.3 0,5-2² F LANG YASAKI	???	\N	0.75	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
26	7116-2090	270619680	COSS 6.3 0,5-2² F LANG YASAKI	???	\N	1	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
27	7116-2090	270619680	COSS 6.3 0,5-2² F LANG YASAKI	???	\N	1.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
28	7116-2090	270619680	COSS 6.3 0,5-2² F LANG YASAKI	???	\N	2	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
29	7114-2020	270619670	COSS 6.3 0,5-2² M YASAKI	???	\N	0.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
30	7114-2020	270619670	COSS 6.3 0,5-2² M YASAKI	???	\N	0.75	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
31	7114-2020	270619670	COSS 6.3 0,5-2² M YASAKI	???	\N	1	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
32	7114-2020	270619670	COSS 6.3 0,5-2² M YASAKI	???	\N	1.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
33	7114-2020	270619670	COSS 6.3 0,5-2² M YASAKI	???	\N	2	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
34	962835-3	270626120	COSS 9,5 1-2,5² LANGET NU F	P9	\N	1.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
35	962835-3	270626120	COSS 9,5 1-2,5² LANGET NU F	P9	\N	2.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
36	280756-2	270626130	COSS 9,5 3-5² LANGET NU F	P9	\N	4	≥ 320	6,59 à 7,13	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
37	VN0101600041	270617330	COSS AMPH C16 T1.5 0,5-1,5² M	P106 / E35	\N	0.5	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
38	VN0101600041	270617330	COSS AMPH C16 T1.5 0,5-1,5² M	P106 / E35	\N	0.75	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
39	VN0101600041	270617330	COSS AMPH C16 T1.5 0,5-1,5² M	P106 / E35	\N	1	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
40	VN0101600041	270617330	COSS AMPH C16 T1.5 0,5-1,5² M	P106 / E35	\N	1.5	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
41	VN0201500471	270614360	COSS AMPH C16 T1.5 0,75-1² F	P106 / E35	\N	0.75	≥ 85	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
42	VN0201500471	270614360	COSS AMPH C16 T1.5 0,75-1² F	P106 / E35	\N	1	≥ 108	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
43	VN010250001101	270614350	COSS AMPH C16 T2.5 1,5-2,5²	???	\N	1.5	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
44	VN010250001101	270614350	COSS AMPH C16 T2.5 1,5-2,5²	???	\N	2.5	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
45	VN0201600021	270626480	COSS AMPH F 0,5 à 1,5² VN 02	P138 / E47	\N	0.5	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
46	VN0201600021	270626480	COSS AMPH F 0,5 à 1,5² VN 02	P138 / E47	\N	0.75	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
47	VN0201600021	270626480	COSS AMPH F 0,5 à 1,5² VN 02	P138 / E47	\N	1	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
48	VN0201600021	270626480	COSS AMPH F 0,5 à 1,5² VN 02	P138 / E47	\N	1.5	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
49	SP20M2F	270612020	COSS AMPH RT T16 0,35-0,5² M B	P83 / A32 / E32	22	0.35	≥ 36	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
50	SP20M2F	270612020	COSS AMPH RT T16 0,35-0,5² M B	P83 / A32 / E32	20	0.5	≥ 58	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
51	SP16M1F	270612030	COSS AMPH RT T16 0,75-1,5² M B	P83 / A33 / E32	18	0.75	≥ 89	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
52	SP16M1F	270612030	COSS AMPH RT T16 0,75-1,5² M B	P83 / A33 / E32	\N	1	≥ 105	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
53	SP16M1F	270612030	COSS AMPH RT T16 0,75-1,5² M B	P83 / A33 / E32	16	1.5	≥ 134	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
54	AT62-12-0166	270623170	COSS AMPH T12 2-4² F BAN	???	\N	2	≥ 311	5,72 à 7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
55	AT62-12-0166	270623170	COSS AMPH T12 2-4² F BAN	???	\N	2.5	≥ 311	5,72 à 7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
56	AT62-12-0166	270623170	COSS AMPH T12 2-4² F BAN	???	\N	3	≥ 311	5,72 à 7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
57	AT62-12-0166	270623170	COSS AMPH T12 2-4² F BAN	???	\N	4	≥ 311	5,72 à 7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
58	AT62-201-16141-22	270624010	COSS AMPH T16 0,2-0,34² F VRAC	P136	\N	\N	\N	\N	Plan et lien fab ok	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
59	AT60-202-16141-22	270623910	COSS AMPH T16 0,2-0,34² M VRAC	P136	\N	\N	\N	\N	Plan et lien fab ok	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
60	AT62-16-0622	270621040	COSS AMPH T16 0,5-1² F BAN	P51 - P52	\N	0.5	≥ 67	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
61	AT62-16-0622	270621040	COSS AMPH T16 0,5-1² F BAN	P51 - P53	\N	0.7	≥ 111	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
62	AT62-16-0622	270621040	COSS AMPH T16 0,5-1² F BAN	P51 - P54	\N	1	≥ 111	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
63	AT62-203-08141-16	270619540	COSS AMPH T8 13-16²	???	\N	\N	\N	\N	Plan et lien fab ok	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
64	AT62-203-08141	270621050	COSS AMPH T8 5-10² F VRAC	P19 - P340	\N	\N	\N	\N	Plan et lien fab ok	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
65	104479-8	270608640	COSS AMPMODU 0,2-0,6²	P37 / E161	24	0.2	???	3,18 - 3,96	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
66	104479-8	270608640	COSS AMPMODU 0,2-0,6²	P37 / E161	22	0.35	???	3,18 - 3,96	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
67	104479-8	270608640	COSS AMPMODU 0,2-0,6²	P37 / E161	20	0.6	???	3,18 - 3,96	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
68	770854-1	270600650	COSS AMPSEAL 0,5-1,5² F B ETAM	P5 - P84 - A22	\N	0.5	≥ 80	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
69	770854-1	270600650	COSS AMPSEAL 0,5-1,5² F B ETAM	P5 - P84 - A22	\N	0.75	≥ 90	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
70	770854-1	270600650	COSS AMPSEAL 0,5-1,5² F B ETAM	P5 - P84 - A22	\N	1	???	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
71	770854-1	270600650	COSS AMPSEAL 0,5-1,5² F B ETAM	P5 - P84 - A22	\N	1.5	≥ 150	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
72	770520-3	270612540	COSS AMPSEAL 0,5-1,5² F B OR	P5 - P84 - A22	\N	0.5	≥ 80	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
73	770520-3	270612540	COSS AMPSEAL 0,5-1,5² F B OR	P5 - P84 - A22	\N	0.75	≥ 90	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
74	770520-3	270612540	COSS AMPSEAL 0,5-1,5² F B OR	P5 - P84 - A22	\N	1	???	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
75	770520-3	270612540	COSS AMPSEAL 0,5-1,5² F B OR	P5 - P84 - A22	\N	1.5	≥ 150	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
76	770854-3	270612360	COSS AMPSEAL 0,5-1,5² F V OR	P5 - P84 - A22	\N	0.5	≥ 80	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
77	770854-3	270612360	COSS AMPSEAL 0,5-1,5² F V OR	P5 - P84 - A22	\N	0.75	≥ 90	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
78	770854-3	270612360	COSS AMPSEAL 0,5-1,5² F V OR	P5 - P84 - A22	\N	1	???	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
79	770854-3	270612360	COSS AMPSEAL 0,5-1,5² F V OR	P5 - P84 - A22	\N	1.5	≥ 150	5.1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
80	1924464-2	270616780	COSS AMPSEAL16 0,5-0,75² FB NI	P115	20	0.5	≥ 75	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
81	1924464-2	270616780	COSS AMPSEAL16 0,5-0,75² FB NI	P115	18	0.75	≥ 90	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
82	1924464-1	270618660	COSS AMPSEAL16 0,5-0,75² FB OR	P115	20	0.5	≥ 75	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
83	1924464-1	270618660	COSS AMPSEAL16 0,5-0,75² FB OR	P115	18	0.75	≥ 90	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
84	1924463-3	270616890	COSS AMPSEAL16 0,5-0,75² MB NI	P115	20	0.5	≥ 75	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
85	1924463-3	270616890	COSS AMPSEAL16 0,5-0,75² MB NI	P115	18	0.75	≥ 90	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
86	1924463-1	270618640	COSS AMPSEAL16 0,5-0,75² MB OR	P115	20	0.5	≥ 75	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
87	1924463-1	270618640	COSS AMPSEAL16 0,5-0,75² MB OR	P115	18	0.75	≥ 90	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
88	2098251-2	270616520	COSS AMPSEAL16 0,75-1,5² FB NI	P112	18	0.75	≥ 90	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
89	2098251-2	270616520	COSS AMPSEAL16 0,75-1,5² FB NI	P112	16	1	≥ 120	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
90	2098251-2	270616520	COSS AMPSEAL16 0,75-1,5² FB NI	P112	14	1.5	≥ 180	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
91	2098251-1	270618670	COSS AMPSEAL16 0,75-1,5² FB OR	P112	18	0.75	≥ 90	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
92	2098251-1	270618670	COSS AMPSEAL16 0,75-1,5² FB OR	P112	16	1	≥ 120	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
93	2098251-1	270618670	COSS AMPSEAL16 0,75-1,5² FB OR	P112	14	1.5	≥ 180	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
94	2098250-3	270616880	COSS AMPSEAL16 0,75-1,5² MB NI	P5 - P84	18	0.75	≥ 90	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
95	2098250-3	270616880	COSS AMPSEAL16 0,75-1,5² MB NI	P5 - P84	16	1	≥ 120	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
96	2098250-3	270616880	COSS AMPSEAL16 0,75-1,5² MB NI	P5 - P84	14	1.5	≥ 180	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
97	2098250-1	270618650	COSS AMPSEAL16 0,75-1,5² MB OR	P5 - P84	18	0.75	≥ 90	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
98	2098250-1	270618650	COSS AMPSEAL16 0,75-1,5² MB OR	P5 - P84	16	1	≥ 120	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
99	2098250-1	270618650	COSS AMPSEAL16 0,75-1,5² MB OR	P5 - P84	14	1.5	≥ 180	5.08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
100	1319-BK	270614580	COSS ANDERSON 1319-BK 35²	P19 (400-BHD + 1388G4 +1389G4)	\N	???	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
101	1319G6	270616070	COSS ANDERSON 1319G6 6²	P19 (400-BHD + 1388G6 +1389G6)	\N	???	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
102	5952-BK	270616120	COSS ANDERSON 5952 AWG8 8,4²	UP60	\N	???	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
103	13624983	270624670	COSS APEX 1,5 0,35-0,5² F B	???	\N	0.35	≥ 50	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
104	13624983	270624670	COSS APEX 1,5 0,35-0,5² F B	???	\N	0.5	≥ 80	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
105	13613157	270624660	COSS APEX 1,5 0,75-1² F B	???	\N	0.75	≥ 120	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
106	13613157	270624660	COSS APEX 1,5 0,75-1² F B	???	\N	1	≥ 160	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
107	10757690	270616200	COSS APEX 2.8 0,5-1² F B	P113	\N	0.5	≥ 75	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
108	10757690	270616200	COSS APEX 2.8 0,5-1² F B	P113	\N	0.75	≥ 120	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
109	10757690	270616200	COSS APEX 2.8 0,5-1² F B	P113	\N	1	≥ 160	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
110	61-0897-139	270567610	COSS BINDER S692-693 0,5² F	P27 - P50  /  E14 - E23	\N	0.5	???	8.2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
111	61-0892-139	270599170	COSS BINDER S692-693 0,5² M	P27 - P50  /  E14 - E23	\N	0.5	???	8.2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
112	61-0898-139	270567620	COSS BINDER S692-693 0,75-1² F	P27 - P50  /  E14 - E23	\N	0.75	???	8.2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
113	61-0898-139	270567620	COSS BINDER S692-693 0,75-1² F	P27 - P50  /  E14 - E23	\N	1	???	8.2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
114	61-0893-139	270608480	COSS BINDER S692-693 0,75-1²M	P27 - P50  /  E14 - E23	\N	0.75	???	8.2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
115	61-0893-139	270608480	COSS BINDER S692-693 0,75-1²M	P27 - P50  /  E14 - E23	\N	1	???	8.2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
116	61-0899-139	270599130	COSS BINDER S692-693 1,5² F	P27 - P50  /  E14 - E23	\N	1.5	???	8.2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
117	61-0894-139	270599160	COSS BINDER S692-693 1,5² M	P27 - P50  /  E14 - E23	\N	1.5	???	8.2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
118	61-0900-139	270608150	COSS BINDER S696 2,5² F	P27 - P50  /  E14 - E23	\N	2.5	???	8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
119	61-0902-139	270608130	COSS BINDER S696 2.5² M	P27 - P50  /  E14 - E23	\N	2.5	???	8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
120	4250000872	270567042	COSS CINCH 0,5-0,8² FEM	P29 - P28 / A13 / E12 - E13 - E28 - E29	20	0.5	≥ 36	4.5	Avec empreinte 20	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
121	4250000872	270567042	COSS CINCH 0,5-0,8² FEM	P29 - P28 / A13 / E12 - E13 - E28 - E29	18	0.8	≥ 47	4.5	Avec empreinte 18	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
122	4250000872	270567042	COSS CINCH 0,5-0,8² FEM	P29 - P28 / A13 / E12 - E13 - E28 - E29	16	1	≥ 37	4.5	Avec empreinte 16	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
123	4250000873	270567043	COSS CINCH 0,8-2² FEM	P65 - P30 / A29 / E12 - E13 - E28 - E29	18	0.75	≥ 37	4.5	Avec empreinte 16GXL	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
124	4250000873	270567043	COSS CINCH 0,8-2² FEM	P65 - P30 / A29 / E12 - E13 - E28 - E29	16	1	≥ 58	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
125	4250000873	270567043	COSS CINCH 0,8-2² FEM	P65 - P30 / A29 / E12 - E13 - E28 - E29	14	2	≥ 62	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
126	64322-1039	270617050	COSS CP 0,6 0,5² B	P109 / E36	\N	0.5	≥ 70	3,4 à 3,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
127	64322-1029	270616670	COSS CP 0,6 0,75² B	P109 / E36	\N	0.75	≥ 90	3,4 à 3,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
128	64323-1029	270616680	COSS CP 1,5 0,5-1² B	P110 / E37	\N	0.5	≥ 70	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
129	64323-1029	270616680	COSS CP 1,5 0,5-1² B	P110 / E37	\N	0.75	≥ 90	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
130	64323-1029	270616680	COSS CP 1,5 0,5-1² B	P110 / E37	\N	1	≥ 115	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
131	64323-1039	270617060	COSS CP 1,5 1,5-2² B	P135 / E37	\N	1.5	≥ 155	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
132	64323-1039	270617060	COSS CP 1,5 1,5-2² B	P135 / E37	\N	2	≥ 195	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
133	64324-1049	270617070	COSS CP 2,8 0,5-1² B	P121 / E41	\N	0.5	≥ 70	4,9 à 5,1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
134	64324-1049	270617070	COSS CP 2,8 0,5-1² B	P121 / E41	\N	0.75	≥ 90	4,9 à 5,1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
135	64324-1049	270617070	COSS CP 2,8 0,5-1² B	P121 / E41	\N	1	≥ 115	4,9 à 5,1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
136	64324-1039	270617150	COSS CP 2,8 1,5-2² B	P134 / E41	\N	1.5	≥ 155	4,9 à 5,1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
137	64324-1039	270617150	COSS CP 2,8 1,5-2² B	P134 / E41	\N	2	≥ 195	4,9 à 5,1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
138	64324-1029	270622710	COSS CP 2,8 2,5-3² B	P133 / E41	\N	2.5	≥ 235	4,9 à 5,1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
139	64324-1029	270622710	COSS CP 2,8 2,5-3² B	P133 / E41	\N	3	≥ 260	4,9 à 5,1	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
140	1-66399-0	270609030	COSS CPC 0,2-0,56² FEM V	P40 / E4	24	0.2	≥ 31	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
141	1-66399-0	270609030	COSS CPC 0,2-0,56² FEM V	P40 / E4	22	0.35	≥ 44	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
142	1-66399-0	270609030	COSS CPC 0,2-0,56² FEM V	P40 / E4	20	0.5	≥ 75	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
143	2-66102-5	270619390	COSS CPC 0,2-0,56² MAL BANDE	P40 / E4	24	0.2	≥ 31	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
144	2-66102-5	270619390	COSS CPC 0,2-0,56² MAL BANDE	P40 / E4	22	0.35	≥ 44	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
145	2-66102-5	270619390	COSS CPC 0,2-0,56² MAL BANDE	P40 / E4	20	0.5	≥ 75	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
146	163086-1	270609050	COSS CPC 0,2-0,56² MAL V	P40 / E4	24	0.2	≥ 31	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
147	163086-1	270609050	COSS CPC 0,2-0,56² MAL V	P40 / E4	22	0.35	≥ 44	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
148	163086-1	270609050	COSS CPC 0,2-0,56² MAL V	P40 / E4	20	0.5	≥ 75	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
149	1-66400-0	270613910	COSS CPC 0,2-0,56² MAL V	P40 / E4	24	0.2	≥ 31	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
150	1-66400-0	270613910	COSS CPC 0,2-0,56² MAL V	P40 / E4	22	0.35	≥ 44	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
151	1-66400-0	270613910	COSS CPC 0,2-0,56² MAL V	P40 / E4	20	0.5	≥ 75	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
152	66399-3	270619270	COSS CPC 0,2-0,56² OR FEM	P40 / E4	24	0.2	≥ 31	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
153	66399-3	270619270	COSS CPC 0,2-0,56² OR FEM	P40 / E4	22	0.35	≥ 44	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
154	66399-3	270619270	COSS CPC 0,2-0,56² OR FEM	P40 / E4	20	0.5	≥ 75	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
155	1-66100-9	270610410	COSS CPC 0,75-1,5² FEM BANDE	P40 / A11 - A11-1 / E4	20	0.75	≥ 75	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
156	1-66100-9	270610410	COSS CPC 0,75-1,5² FEM BANDE	P40 / A11 - A11-1 / E4	18	1	≥ 111	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
157	1-66100-9	270610410	COSS CPC 0,75-1,5² FEM BANDE	P40 / A11 - A11-1 / E4	16	1.5	≥ 178	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
158	1-66101-9	270600340	COSS CPC 0,75-1,5² FEM VRAC	P40 / E4	20	0.75	≥ 75	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
159	1-66101-9	270600340	COSS CPC 0,75-1,5² FEM VRAC	P40 / E4	18	1	≥ 111	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
160	1-66101-9	270600340	COSS CPC 0,75-1,5² FEM VRAC	P40 / E4	16	1.5	≥ 178	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
161	1-66098-8	270610400	COSS CPC 0,75-1,5² MAL BANDE	P40 / A11 - A11-1 / E4	20	0.75	≥ 75	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
162	1-66098-8	270610400	COSS CPC 0,75-1,5² MAL BANDE	P40 / A11 - A11-1 / E4	18	1	≥ 111	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
163	1-66098-8	270610400	COSS CPC 0,75-1,5² MAL BANDE	P40 / A11 - A11-1 / E4	16	1.5	≥ 178	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
164	1-66099-5	270606710	COSS CPC 0,75-1,5² MAL VRAC	P40 / E4	20	0.75	≥ 75	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
165	1-66099-5	270606710	COSS CPC 0,75-1,5² MAL VRAC	P40 / E4	18	1	≥ 111	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
166	1-66099-5	270606710	COSS CPC 0,75-1,5² MAL VRAC	P40 / E4	16	1.5	≥ 178	3,58 à 4,34	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
167	193990-2	270606810	COSS CPC 8mm² FEM	P23 / E2	8	\N	???	9.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
168	193991-4	270606740	COSS CPC 8mm² MAL	P23 / E2	8	\N	???	9.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
169	13627884	270616220	COSS DELPHI OCS 1.2 0,35-0,5²F	P114	\N	0.35	≥ 50	4.6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
170	13627884	270616220	COSS DELPHI OCS 1.2 0,35-0,5²F	P114	\N	0.5	≥ 75	4.6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
171	35072397	270618280	COSS DELPHI OCS 1.2 0,75² F	???	\N	0.75	≥ 120	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
172	DARS24296-000A3	270611240	COSS DEUTS PR CARxPC68 6² M	P4 / P19	\N	6	≥ 650	12	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
173	DARS24263-000A3	270611250	COSS DEUTS PR CARxSC68 6² F	P4 / P19	\N	6	≥ 650	12	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
174	0462-203-12141	270567075	COSS DEUTS T12 2-3² F VRAC	P6 - P25	\N	3.00	≥ 334	5,64 à 7,21	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
175	0462-203-12141	270567075	COSS DEUTS T12 2-3² F VRAC	P6 - P25	\N	2 - 2,5	≥ 311	5,64 à 7,21	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
176	0460-204-12141	270567078	COSS DEUTS T12 2-3² M VRAC	P6 - P25	\N	3.00	≥ 334	5,64 à 7,21	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
177	0460-204-12141	270567078	COSS DEUTS T12 2-3² M VRAC	P6 - P25	\N	2 - 2,5	≥ 311	5,64 à 7,21	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
178	1062-12-0166	270600880	COSS DEUTS T12 2-4² F B	P74 - P75	\N	2	≥ 222	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
179	1062-12-0166	270600880	COSS DEUTS T12 2-4² F B	P74 - P75	\N	2.5	≥ 222	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
180	1062-12-0166	270600880	COSS DEUTS T12 2-4² F B	P74 - P75	\N	4	≥311	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
181	1060-12-0166	270600870	COSS DEUTS T12 2-4² M B	P74 - P75	\N	2	≥ 222	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
182	1060-12-0166	270600870	COSS DEUTS T12 2-4² M B	P74 - P75	\N	2.5	≥ 222	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
183	1060-12-0166	270600870	COSS DEUTS T12 2-4² M B	P74 - P75	\N	4	≥311	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
184	1062-12-0222	270610960	COSS DEUTS T12 4-6² F B	P69 - P80	\N	4	≥311	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
185	1062-12-0222	270610960	COSS DEUTS T12 4-6² F B	P69 - P80	\N	6	≥311	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
186	1060-12-0222	270613570	COSS DEUTS T12 4-6² M B	P69 - P80	\N	4	≥311	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
187	1060-12-0222	270613570	COSS DEUTS T12 4-6² M B	P69 - P80	\N	6	≥311	6,35 à 7,62	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
188	0462-201-16141	270567026	COSS DEUTS T16 0,5-1,5² F VR	P6 - P25	\N	1.5	≥ 156	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
189	0462-201-16141	270567026	COSS DEUTS T16 0,5-1,5² F VR	P6 - P25	\N	1	≥ 156	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
190	0462-201-16141	270567026	COSS DEUTS T16 0,5-1,5² F VR	P6 - P25	\N	0.75	≥ 111	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
191	0462-201-16141	270567026	COSS DEUTS T16 0,5-1,5² F VR	P6 - P25	\N	0.5	≥ 89	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
192	0460-202-16141	270567069	COSS DEUTS T16 0,5-1,5² M VR	P6 - P25	\N	1.5	≥ 156	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
193	0460-202-16141	270567069	COSS DEUTS T16 0,5-1,5² M VR	P6 - P25	\N	1	≥ 156	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
194	0460-202-16141	270567069	COSS DEUTS T16 0,5-1,5² M VR	P6 - P25	\N	0.75	≥ 111	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
195	0460-202-16141	270567069	COSS DEUTS T16 0,5-1,5² M VR	P6 - P25	\N	0.5	≥ 89	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
196	1062-16-0622	270610160	COSS DEUTS T16 0,5-1² F BAN	P51 - P52 / A18	\N	0.5	≥ 67	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
197	1062-16-0622	270610160	COSS DEUTS T16 0,5-1² F BAN	P51 - P52 / A18	\N	0.75	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
198	1062-16-0622	270610160	COSS DEUTS T16 0,5-1² F BAN	P51 - P52 / A18	\N	1	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
199	1062-16-0644	270612620	COSS DEUTS T16 0,5-1² F BAN OR	P51 - P52 / A18	\N	0.5	≥ 67	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
200	1062-16-0644	270612620	COSS DEUTS T16 0,5-1² F BAN OR	P51 - P52 / A18	\N	0.75	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
201	1062-16-0644	270612620	COSS DEUTS T16 0,5-1² F BAN OR	P51 - P52 / A18	\N	1	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
202	1060-16-0622	270610170	COSS DEUTS T16 0,5-1² M BAN	P51 - P52 / A18	\N	0.5	≥ 67	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
203	1060-16-0622	270610170	COSS DEUTS T16 0,5-1² M BAN	P51 - P52 / A18	\N	0.75	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
204	1060-16-0622	270610170	COSS DEUTS T16 0,5-1² M BAN	P51 - P52 / A18	\N	1	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
205	1062-16-0122	270608760	COSS DEUTS T16 0,75-2² F BAN	P35 - P43 / A10	\N	0.75	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
206	1062-16-0122	270608760	COSS DEUTS T16 0,75-2² F BAN	P35 - P43 / A10	\N	1	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
207	1062-16-0122	270608760	COSS DEUTS T16 0,75-2² F BAN	P35 - P43 / A10	\N	1.5	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
208	1062-16-0122	270608760	COSS DEUTS T16 0,75-2² F BAN	P35 - P43 / A10	\N	2	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
209	1062-16-0988	270621780	COSS DEUTS T16 0,75-2² F BAN O	P35 - P43 / A10	\N	0.75	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
210	1062-16-0988	270621780	COSS DEUTS T16 0,75-2² F BAN O	P35 - P43 / A10	\N	1	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
211	1062-16-0988	270621780	COSS DEUTS T16 0,75-2² F BAN O	P35 - P43 / A10	\N	1.5	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
212	1062-16-0988	270621780	COSS DEUTS T16 0,75-2² F BAN O	P35 - P43 / A10	\N	2	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
213	1060-16-0122	270608560	COSS DEUTS T16 0,75-2² M BAN	P35 - P43 / A10	\N	0.75	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
214	1060-16-0122	270608560	COSS DEUTS T16 0,75-2² M BAN	P35 - P43 / A10	\N	1	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
215	1060-16-0122	270608560	COSS DEUTS T16 0,75-2² M BAN	P35 - P43 / A10	\N	1.5	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
216	1060-16-0122	270608560	COSS DEUTS T16 0,75-2² M BAN	P35 - P43 / A10	\N	2	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
217	1062-16-1222	270610680	COSS DEUTS T16 1-2,5² F BAN	P56 - P81 / A30	\N	1	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
218	1062-16-1222	270610680	COSS DEUTS T16 1-2,5² F BAN	P56 - P81 / A30	\N	1.5	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
219	1062-16-1222	270610680	COSS DEUTS T16 1-2,5² F BAN	P56 - P81 / A30	\N	2	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
220	1062-16-1222	270610680	COSS DEUTS T16 1-2,5² F BAN	P56 - P81 / A30	\N	2.5	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
221	1060-16-1222	270610660	COSS DEUTS T16 1-2,5² M BAN	P56 - P81 / A30	\N	1	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
222	1060-16-1222	270610660	COSS DEUTS T16 1-2,5² M BAN	P56 - P81 / A30	\N	1.5	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
223	1060-16-1222	270610660	COSS DEUTS T16 1-2,5² M BAN	P56 - P81 / A30	\N	2	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
224	1060-16-1222	270610660	COSS DEUTS T16 1-2,5² M BAN	P56 - P81 / A30	\N	2.5	≥ 111	3,8 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
225	0462-209-16141	270600850	COSS DEUTS T16 2² F VRAC	P6 - P25	14	2	≥ 311	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
226	0460-215-16141	270606300	COSS DEUTS T16 2² M VRAC	P6 - P25	14	2	≥ 311	6,35 à 7,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
227	1062-20-0122	270608830	COSS DEUTS T20 0,35-1,5² F B	P36 - P44 / A12	\N	0.35	≥ 45	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
340	SEH-001T-P0.6	923926200	COSS JST SEH-001T-P0.6 FEM	P102	30	0.05	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
228	1062-20-0122	270608830	COSS DEUTS T20 0,35-1,5² F B	P36 - P44 / A12	\N	0.5	≥ 67	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
229	1062-20-0122	270608830	COSS DEUTS T20 0,35-1,5² F B	P36 - P44 / A12	\N	0.75	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
230	1062-20-0122	270608830	COSS DEUTS T20 0,35-1,5² F B	P36 - P44 / A12	\N	1	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
231	1062-20-0122	270608830	COSS DEUTS T20 0,35-1,5² F B	P36 - P44 / A12	\N	1.5	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
232	1060-20-0222	270609950	COSS DEUTS T20 0,35-1,5² M B	P36 - P44 / A12	\N	0.35	≥ 45	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
233	1060-20-0222	270609950	COSS DEUTS T20 0,35-1,5² M B	P36 - P44 / A12	\N	0.5	≥ 67	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
234	1060-20-0222	270609950	COSS DEUTS T20 0,35-1,5² M B	P36 - P44 / A12	\N	0.75	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
235	1060-20-0222	270609950	COSS DEUTS T20 0,35-1,5² M B	P36 - P44 / A12	\N	1	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
236	1060-20-0222	270609950	COSS DEUTS T20 0,35-1,5² M B	P36 - P44 / A12	\N	1.5	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
237	0462-201-20141	270610710	COSS DEUTS T20 0,5² F VRAC	P6 - P25	20	0.5	≥ 89	3,96 à 5,54	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
238	0460-202-20141	270640000	COSS DEUTS T20 0,5² M VRAC	P6 - P25	20	0.5	≥ 89	3,96 à 5,54	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
239	1062-20-0622	270623580	COSS DEUTS T20 1-2,5² F B	P81	\N	1	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
240	1062-20-0622	270623580	COSS DEUTS T20 1-2,5² F B	P81	\N	1.5	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
241	1062-20-0622	270623580	COSS DEUTS T20 1-2,5² F B	P81	\N	2	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
242	1062-20-0622	270623580	COSS DEUTS T20 1-2,5² F B	P81	\N	2.5	≥ 89	3,81 à 5,08	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
243	0462-203-04141	270613240	COSS DEUTS T4 13-16² F VRAC	P19 - P340	6	13-16	≥ 1334	10,92 à 12,50	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
244	0460-204-0490	270613140	COSS DEUTS T4 13-16² M VRAC	P19 - P340	6	13-16	≥ 1330	10,92 à 12,50	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
245	0462-203-08141	270567074	COSS DEUTS T8 5-10² F VRAC	P19 - P340	10	5-6	≥ 400	10,92 à 12,50	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
246	0462-203-08141	270567074	COSS DEUTS T8 5-10² F VRAC	P19 - P340	8	8	≥ 556	10,92 à 12,50	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
247	0460-204-08141	270567046	COSS DEUTS T8 5-10² M VRAC	P19 - P340	10	5-6	≥ 400	10,92 à 12,50	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
248	0460-204-08141	270567046	COSS DEUTS T8 5-10² M VRAC	P19 - P340	8	8	≥ 556	10,92 à 12,50	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
249	929989-1	270609770	COSS DIN 72585 T1.5 0,5-1² F B	P49 - P79 / A28 / E24	\N	0.5	≥ 60	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
250	929989-1	270609770	COSS DIN 72585 T1.5 0,5-1² F B	P49 - P79 / A28 / E24	\N	0.75	???	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
251	929989-1	270609770	COSS DIN 72585 T1.5 0,5-1² F B	P49 - P79 / A28 / E24	\N	1	≥ 100	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
252	1703013-1	270609780	COSS DIN 72585 T1.5 0,5-1² M B	P49 - P79 / A28 / E22	\N	0.5	≥ 60	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
253	1703013-1	270609780	COSS DIN 72585 T1.5 0,5-1² M B	P49 - P79 / A28 / E22	\N	0.75	???	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
254	1703013-1	270609780	COSS DIN 72585 T1.5 0,5-1² M B	P49 - P79 / A28 / E22	\N	1	≥ 100	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
255	929990-1	270609790	COSS DIN 72585 T1.5 1-2,5² F B	P76 / E24	\N	1	≥ 100	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
256	929990-1	270609790	COSS DIN 72585 T1.5 1-2,5² F B	P76 / E24	\N	1.5	≥ 150	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
257	929990-1	270609790	COSS DIN 72585 T1.5 1-2,5² F B	P76 / E24	\N	2.5	≥ 200	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
258	1703014-1	270609800	COSS DIN 72585 T1.5 1-2,5² M B	P76 / E22	\N	1	≥ 100	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
259	1703014-1	270609800	COSS DIN 72585 T1.5 1-2,5² M B	P76 / E22	\N	1.5	≥ 150	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
260	1703014-1	270609800	COSS DIN 72585 T1.5 1-2,5² M B	P76 / E22	\N	2.5	≥ 200	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
261	929974-1	270607170	COSS DIN 72585 T2.5 0,5-1² F B	P49 / P79 / E21 / E210	\N	0.5	≥ 60	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
262	929974-1	270607170	COSS DIN 72585 T2.5 0,5-1² F B	P49 / P79 / E21 / E210	\N	0.75	???	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
263	929974-1	270607170	COSS DIN 72585 T2.5 0,5-1² F B	P49 / P79 / E21 / E210	\N	1	≥ 100	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
264	929967-1	270607160	COSS DIN 72585 T2.5 0,5-1² M B	P49 / P79 / E21 / E210	\N	0.5	≥ 60	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
265	929967-1	270607160	COSS DIN 72585 T2.5 0,5-1² M B	P49 / P79 / E21 / E210	\N	0.75	???	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
266	929967-1	270607160	COSS DIN 72585 T2.5 0,5-1² M B	P49 / P79 / E21 / E210	\N	1	≥ 100	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
267	929975-1	270607840	COSS DIN 72585 T2.5 1-2,5² F B	P49 / P79 / E21 / E210	\N	1	≥ 100	5,2 à 5,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
268	929975-1	270607840	COSS DIN 72585 T2.5 1-2,5² F B	P49 / P79 / E21 / E210	\N	1.5	≥ 150	5,2 à 5,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
269	929975-1	270607840	COSS DIN 72585 T2.5 1-2,5² F B	P49 / P79 / E21 / E210	\N	2.5	≥ 200	5,2 à 5,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
270	929968-1	270607860	COSS DIN 72585 T2.5 1-2,5² M B	P49 / P79 / E21 / E210	\N	1	≥ 100	5,2 à 5,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
271	929968-1	270607860	COSS DIN 72585 T2.5 1-2,5² M B	P49 / P79 / E21 / E210	\N	1.5	≥ 150	5,2 à 5,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
272	929968-1	270607860	COSS DIN 72585 T2.5 1-2,5² M B	P49 / P79 / E21 / E210	\N	2.5	≥ 200	5,2 à 5,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
273	76347-301LF	270614750	COSS DUBOX 0,05-0,34² F V	P108	22	\N	???	2,75 à 3,25	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
274	76347-301LF	270614750	COSS DUBOX 0,05-0,34² F V	P108	24	\N	???	2,75 à 3,25	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
275	76347-301LF	270614750	COSS DUBOX 0,05-0,34² F V	P108	26	\N	???	2,75 à 3,25	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
276	76347-301LF	270614750	COSS DUBOX 0,05-0,34² F V	P108	28	\N	???	2,75 à 3,25	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
277	76347-301LF	270614750	COSS DUBOX 0,05-0,34² F V	P108	30	\N	???	2,75 à 3,25	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
278	171662-1	270608610	COSS ECONOSEAL 0,5-1,25² F	P38 / E17	20	0.5	≥ 88,3	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
279	171662-1	270608610	COSS ECONOSEAL 0,5-1,25² F	P38 / E17	18	0.85	≥ 127,5	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
280	171662-1	270608610	COSS ECONOSEAL 0,5-1,25² F	P38 / E17	16	1.4	≥ 176,5	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
281	60040041	270614420	COSS F DCSI 6,3 1,5-2.5²	P60 sans le positionneur	\N	1.5	???	5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
341	SEH-001T-P0.6	923926200	COSS JST SEH-001T-P0.6 FEM	P102	28	0.08	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
282	60040041	270614420	COSS F DCSI 6,3 1,5-2.5²	P60 sans le positionneur	\N	2	???	5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
283	60040041	270614420	COSS F DCSI 6,3 1,5-2.5²	P60 sans le positionneur	\N	2.5	???	5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
284	60070261	270614410	COSS F DCSI 9,5 4-6²	P63 sans le positionneur	\N	4	≥ 350	6.6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
285	60070261	270614410	COSS F DCSI 9,5 4-6²	P63 sans le positionneur	\N	6	≥ 500	6.6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
286	160458-2	270626160	COSS FASTON 250 M 0,75-1,5² LA	???	\N	0.75	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
287	160458-2	270626160	COSS FASTON 250 M 0,75-1,5² LA	???	\N	1	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
288	160458-2	270626160	COSS FASTON 250 M 0,75-1,5² LA	???	\N	1.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
289	180430-2	270619820	COSS FASTON250 DRAPO 0,5-1,5²	P125	\N	0.5	???	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
290	180430-2	270619820	COSS FASTON250 DRAPO 0,5-1,5²	P125	\N	0.75	???	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
291	180430-2	270619820	COSS FASTON250 DRAPO 0,5-1,5²	P125	\N	1	???	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
292	180430-2	270619820	COSS FASTON250 DRAPO 0,5-1,5²	P125	\N	1.5	???	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
293	735279	270623550	COSS FASTON250 F 0,3-0,75² IS	???	\N	0.3	≥ 44,5	5,1 à 5,9	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
294	735279	270623550	COSS FASTON250 F 0,3-0,75² IS	???	\N	0.5	≥ 71	5,1 à 5,9	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
295	735279	270623550	COSS FASTON250 F 0,3-0,75² IS	???	\N	0.75	≥ 88	5,1 à 5,9	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
296	60413-1	270617880	COSS FASTON250 F 0,3-0,9² LA B	???	\N	0.3	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
297	60413-1	270617880	COSS FASTON250 F 0,3-0,9² LA B	???	\N	0.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
298	60413-1	270617880	COSS FASTON250 F 0,3-0,9² LA B	???	\N	0.75	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
299	170032-5	270615650	COSS FASTON250 F 0,5-2²	P9 - P48 - P100	\N	0.5	≥ 88	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
300	170032-5	270615650	COSS FASTON250 F 0,5-2²	P9 - P48 - P100	\N	0.85	≥ 127	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
301	170032-5	270615650	COSS FASTON250 F 0,5-2²	P9 - P48 - P100	\N	1.25	≥ 177	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
302	170032-5	270615650	COSS FASTON250 F 0,5-2²	P9 - P48 - P100	\N	2	≥ 265	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
303	61316-1	270625220	COSS FASTON250 M 0,3-0,9² LA B	???	\N	0.35	≥ 60	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
304	61316-1	270625220	COSS FASTON250 M 0,3-0,9² LA B	???	\N	0.5	≥ 70	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
305	61316-1	270625220	COSS FASTON250 M 0,3-0,9² LA B	???	\N	0.75	≥ 90	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
306	170340-3	270615660	COSS FASTON250 M 0,5-2²	P9 - P48 - P100	\N	0.5	≥ 88	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
307	170340-3	270615660	COSS FASTON250 M 0,5-2²	P9 - P48 - P100	\N	0.85	≥ 127	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
308	170340-3	270615660	COSS FASTON250 M 0,5-2²	P9 - P48 - P100	\N	1.25	≥ 177	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
309	170340-3	270615660	COSS FASTON250 M 0,5-2²	P9 - P48 - P100	\N	2	≥ 265	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
310	1735801-1	270621880	COSS HPI AWG 30-24 1735801-1	A31	30	0.05	≥ 7,8	1,9 à 2,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
311	1735801-1	270621880	COSS HPI AWG 30-24 1735801-1	A31	28	0.08	≥ 9,8	1,9 à 2,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
312	1735801-1	270621880	COSS HPI AWG 30-24 1735801-1	A31	26	0.14	≥ 19,6	1,9 à 2,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
313	1735801-1	270621880	COSS HPI AWG 30-24 1735801-1	A31	24	0.22	≥ 29,4	1,9 à 2,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
314	192900-0003	270613780	COSS ITT 0,75-1,5² F V	P96	18	0.75	???	3,7 à 4,2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
315	192900-0003	270613780	COSS ITT 0,75-1,5² F V	P96	17	1	???	3,7 à 4,2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
316	192900-0003	270613780	COSS ITT 0,75-1,5² F V	P96	16	1.5	???	3,7 à 4,2	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
317	1-965982-1	270616740	COSS JPT 0,2-0,5² M B	P7 - P32 / E9 - E91	\N	0.2	≥ 30	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
318	1-965982-1	270616740	COSS JPT 0,2-0,5² M B	P7 - P32 / E9 - E91	\N	0.35	≥ 50	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
319	1-965982-1	270616740	COSS JPT 0,2-0,5² M B	P7 - P32 / E9 - E91	\N	0.5	≥ 60	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
320	1-962916-1	270616730	COSS JPT 1,5-2,5² M B	P61 - P103 / E9 - E91	\N	1.5	≥ 150	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
321	1-962916-1	270616730	COSS JPT 1,5-2,5² M B	P61 - P103 / E9 - E91	\N	2.5	≥ 200	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
322	927771-3	270614120	COSS JPT L=18,8 0,5-1² F B	P7 - P32 / E9 - E91	\N	0.5	≥ 60	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
323	927771-3	270614120	COSS JPT L=18,8 0,5-1² F B	P7 - P32 / E9 - E91	\N	0.75	???	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
324	927771-3	270614120	COSS JPT L=18,8 0,5-1² F B	P7 - P32 / E9 - E91	\N	1	≥ 100	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
325	927768-3	270621120	COSS JPT L=18,8 1,5-2,5² F B	P7 - P32 / E9 - E91	\N	1.5	≥ 150	4 à 4,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
326	927768-3	270621120	COSS JPT L=18,8 1,5-2,5² F B	P7 - P32 / E9 - E91	\N	2	???	4 à 4,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
327	927768-3	270621120	COSS JPT L=18,8 1,5-2,5² F B	P7 - P32 / E9 - E91	\N	2.5	≥ 200	4 à 4,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
328	1-929939-1	270612730	COSS JPT L=21 0,5-1² F B	A23 / P7 - P32 / E9 - E91	\N	0.5	≥ 60	4,3 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
329	1-929939-1	270612730	COSS JPT L=21 0,5-1² F B	A23 / P7 - P32 / E9 - E91	\N	0.75	???	4,3 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
330	1-929939-1	270612730	COSS JPT L=21 0,5-1² F B	A23 / P7 - P32 / E9 - E91	\N	1	≥ 100	4,3 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
331	929939-3	270621030	COSS JPT L=21 0,5-1² F B CuS	A23 / P7 - P32 / E9 - E91	\N	0.5	≥ 60	4,3 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
332	929939-3	270621030	COSS JPT L=21 0,5-1² F B CuS	A23 / P7 - P32 / E9 - E91	\N	0.75	???	4,3 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
333	929939-3	270621030	COSS JPT L=21 0,5-1² F B CuS	A23 / P7 - P32 / E9 - E91	\N	1	≥ 100	4,3 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
334	929940-1	270567027	COSS JPT L=21 0,5-1² F V	P7 - P32 / E9 - E91	\N	0.5	≥ 60	4,3 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
335	929940-1	270567027	COSS JPT L=21 0,5-1² F V	P7 - P32 / E9 - E91	\N	0.75	???	4,3 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
336	929940-1	270567027	COSS JPT L=21 0,5-1² F V	P7 - P32 / E9 - E91	\N	1	≥ 100	4,3 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
337	929938-1	270567720	COSS JPT L=21 1,5-2,5² F V	P7 - P32 / E9 - E91	\N	1.5	≥ 150	4,9 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
338	929938-1	270567720	COSS JPT L=21 1,5-2,5² F V	P7 - P32 / E9 - E91	\N	2	???	4,9 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
339	929938-1	270567720	COSS JPT L=21 1,5-2,5² F V	P7 - P32 / E9 - E91	\N	2.5	≥ 200	4,9 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
342	SEH-001T-P0.6	923926200	COSS JST SEH-001T-P0.6 FEM	P102	26	0.12	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
343	SEH-001T-P0.6	923926200	COSS JST SEH-001T-P0.6 FEM	P102	24	0.22	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
344	SEH-001T-P0.6	923926200	COSS JST SEH-001T-P0.6 FEM	P102	22	0.32	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
345	SPH-002T-P0.5S	270567800	COSS JST SPH-002T-P0.5S FEM	P128 - P200	30	0.05	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
346	SPH-002T-P0.5S	270567800	COSS JST SPH-002T-P0.5S FEM	P128 - P200	28	0.08	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
347	SPH-002T-P0.5S	270567800	COSS JST SPH-002T-P0.5S FEM	P128 - P200	26	0.12	≥ 13	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
348	SPH-002T-P0.5S	270567800	COSS JST SPH-002T-P0.5S FEM	P128 - P200	24	0.22	≥ 22	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
349	SVF-61T-P2.0	270611400	COSS JST SVF-61T-P2.0 FEM	P73 / A19 / E29	20	0.5	≥ 65	5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
350	SVF-61T-P2.0	270611400	COSS JST SVF-61T-P2.0 FEM	P73 / A19 / E29	18	0.75	≥ 80	5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
351	SVF-61T-P2.0	270611400	COSS JST SVF-61T-P2.0 FEM	P73 / A19 / E29	16	1.25	≥ 100	5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
352	SVF-61T-P2.0	270611400	COSS JST SVF-61T-P2.0 FEM	P73 / A19 / E29	14	2	≥ 150	5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
353	SVF-81T-P2.0	270611340	COSS JST SVF-81T-P2.0 FEM	P72 / A21 / E29	12	3.5	≥ 150	5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
354	SWPR-001T-P025	270599760	COSS JST SWPR-001T-P025 FEM	P18	22	0.35	≥ 36	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
355	SWPR-001T-P025	270599760	COSS JST SWPR-001T-P025 FEM	P18	24	0.2	≥ 22	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
356	SWPR-001T-P025	270599760	COSS JST SWPR-001T-P025 FEM	P18	26	0.13	≥ 13	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
357	SWPT-001T-P025	270599790	COSS JST SWPT-001T-P025 MAL	P18	22	0.35	≥ 36	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
358	SWPT-001T-P025	270599790	COSS JST SWPT-001T-P025 MAL	P18	24	0.2	≥ 22	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
359	SWPT-001T-P025	270599790	COSS JST SWPT-001T-P025 MAL	P18	26	0.13	≥ 13	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
360	SXH-001T-P0.6	270611430	COSS JST SXH-001T-P0.6 FEM	P71 / A20 / E30	28	0.08	≥ 9,8	2,1 à 2,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
361	SXH-001T-P0.6	270611430	COSS JST SXH-001T-P0.6 FEM	P71 / A20 / E30	26	0.12	≥ 19,6	2,1 à 2,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
362	SXH-001T-P0.6	270611430	COSS JST SXH-001T-P0.6 FEM	P71 / A20 / E30	24	0.22	≥ 29,4	2,1 à 2,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
363	SXH-001T-P0.6	270611430	COSS JST SXH-001T-P0.6 FEM	P71 / A20 / E30	22	0.32	≥ 39,2	2,1 à 2,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
364	7-1452668-1	270620980	COSS MCON 1.2LL 0,5-0,75² F	A24 / P95 / E33	\N	0.5	≥ 60	3,3 à 3,9	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
365	7-1452668-1	270620980	COSS MCON 1.2LL 0,5-0,75² F	A24 / P95 / E33	\N	0.75	≥ 85	3,3 à 3,9	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
366	1718760-1	270618550	COSS MCON 1.2LL 0,5-0,75² M B	A24 / P95 / E33	\N	0.5	≥ 60	3,3 à 3,9	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
367	1718760-1	270618550	COSS MCON 1.2LL 0,5-0,75² M B	A24 / P95 / E33	\N	0.75	≥ 85	3,3 à 3,9	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
368	1418762-1	270614910	COSS MCON 1.2LL 1-1,5² M	P104 / E33	\N	1	≥ 108	3,3 à 3,9	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
369	1418762-1	270614910	COSS MCON 1.2LL 1-1,5² M	P104 / E33	\N	1.5	≥ 150	3,3 à 3,9	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
370	969028-2	270615060	COSS MCP 1.5K 0,2-0,5² M	P57 / E281 / E42	\N	0.2	≥ 30	3,2 à 3,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
371	969028-2	270615060	COSS MCP 1.5K 0,2-0,5² M	P57 / E281 / E43	\N	0.25	≥ 35	3,2 à 3,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
372	969028-2	270615060	COSS MCP 1.5K 0,2-0,5² M	P57 / E281 / E44	\N	0.35	≥ 50	3,2 à 3,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
373	969028-2	270615060	COSS MCP 1.5K 0,2-0,5² M	P57 / E281 / E45	\N	0.5	≥ 60	3,2 à 3,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
374	1241380-3	270625530	COSS MCP 1.5K 0,5-1² F B ARGEN	P58 / A17 / E25	\N	0.5	≥ 60	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
375	1241380-3	270625530	COSS MCP 1.5K 0,5-1² F B ARGEN	P58 / A17 / E25	\N	0.75	≥ 85	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
376	1241380-3	270625530	COSS MCP 1.5K 0,5-1² F B ARGEN	P58 / A17 / E25	\N	1	≥ 108	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
377	1241380-1	270608000	COSS MCP 1.5K 0,5-1² F B ET	P58 / A17 / E25	\N	0.5	≥ 60	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
378	1241380-1	270608000	COSS MCP 1.5K 0,5-1² F B ET	P58 / A17 / E25	\N	0.75	≥ 85	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
379	1241380-1	270608000	COSS MCP 1.5K 0,5-1² F B ET	P58 / A17 / E25	\N	1	≥ 108	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
380	1241380-2	270618750	COSS MCP 1.5K 0,5-1² F B OR	P58 / A17 / E25	\N	0.5	≥ 60	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
381	1241380-2	270618750	COSS MCP 1.5K 0,5-1² F B OR	P58 / A17 / E25	\N	0.75	≥ 85	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
382	1241380-2	270618750	COSS MCP 1.5K 0,5-1² F B OR	P58 / A17 / E25	\N	1	≥ 108	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
383	964269-2	270608200	COSS MCP 1.5K 0,5-1² M B ET	P57 / A14 / E281 - E42	\N	0.5	≥ 60	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
384	964269-2	270608200	COSS MCP 1.5K 0,5-1² M B ET	P57 / A14 / E281 - E42	\N	0.75	≥ 85	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
385	964269-2	270608200	COSS MCP 1.5K 0,5-1² M B ET	P57 / A14 / E281 - E42	\N	1	≥ 108	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
386	964269-3	270618760	COSS MCP 1.5K 0,5-1² M B OR	P57 / A14 / E281 - E42	\N	0.5	≥ 60	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
387	964269-3	270618760	COSS MCP 1.5K 0,5-1² M B OR	P57 / A14 / E281 - E42	\N	0.75	≥ 85	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
388	964269-3	270618760	COSS MCP 1.5K 0,5-1² M B OR	P57 / A14 / E281 - E42	\N	1	≥ 108	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
389	1703278-2	270608180	COSS MCP 1.5K 1,5² M B	P59 / E281 - E42	\N	1.5	≥ 150	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
390	1418884-1	270608010	COSS MCP 1.5K 1-1,5² F B	P59 / E25	\N	1	≥ 108	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
391	1418884-1	270608010	COSS MCP 1.5K 1-1,5² F B	P59 / E25	\N	1.5	≥ 150	3,7 à 4,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
392	1-968855-1	270610540	COSS MCP 2.8 0,5-1² F B	P62 / E26	\N	0.5	≥ 60	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
393	1-968855-1	270610540	COSS MCP 2.8 0,5-1² F B	P62 / E26	\N	0.75	≥ 85	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
394	1-968855-1	270610540	COSS MCP 2.8 0,5-1² F B	P62 / E26	\N	1	≥ 108	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
395	1-962915-1	270617140	COSS MCP 2.8 0,5-1² M B	P61 / E26	\N	0.5	≥ 60	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
396	1-962915-1	270617140	COSS MCP 2.8 0,5-1² M B	P61 / E26	\N	0.75	≥ 85	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
397	1-962915-1	270617140	COSS MCP 2.8 0,5-1² M B	P61 / E26	\N	1	≥ 108	4,2 à 4,8	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
398	1-962841-1	270614920	COSS MCP 2.8 0,5-1² M B UNSEAL	P103 / P61 / E26	\N	0.5	≥ 60	3,9 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
399	1-962841-1	270614920	COSS MCP 2.8 0,5-1² M B UNSEAL	P103 / P61 / E26	\N	0.75	≥ 85	3,9 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
400	1-962841-1	270614920	COSS MCP 2.8 0,5-1² M B UNSEAL	P103 / P61 / E26	\N	1	≥ 108	3,9 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
401	1-962916-1	270608210	COSS MCP 2.8 1,5-2,5² M B ETAM	P61 / A16 / E26	\N	1	≥ 108	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
402	1-962916-1	270608210	COSS MCP 2.8 1,5-2,5² M B ETAM	P61 / A16 / E26	\N	1.5	≥ 150	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
403	1-962916-1	270608210	COSS MCP 2.8 1,5-2,5² M B ETAM	P61 / A16 / E26	\N	2.5	≥ 200	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
404	1-962916-2	270612960	COSS MCP 2.8 1,5-2,5² MB ARGEN	P61 / A16 / E26	\N	1	≥ 108	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
405	1-962916-2	270612960	COSS MCP 2.8 1,5-2,5² MB ARGEN	P61 / A16 / E26	\N	1.5	≥ 150	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
406	1-962916-2	270612960	COSS MCP 2.8 1,5-2,5² MB ARGEN	P61 / A16 / E26	\N	2.5	≥ 200	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
407	1-968857-3	270612950	COSS MCP 2.8 1-2,5² F B ARGEN	P60 / A15 / E26	\N	1	≥ 108	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
408	1-968857-3	270612950	COSS MCP 2.8 1-2,5² F B ARGEN	P60 / A15 / E26	\N	1.5	≥ 150	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
409	1-968857-3	270612950	COSS MCP 2.8 1-2,5² F B ARGEN	P60 / A15 / E26	\N	2.5	≥ 200	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
410	1-968857-1	270608260	COSS MCP 2.8 1-2,5² F B ETAME	P60 / A15 / E26	\N	1	≥ 108	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
411	1-968857-1	270608260	COSS MCP 2.8 1-2,5² F B ETAME	P60 / A15 / E26	\N	1.5	≥ 150	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
412	1-968857-1	270608260	COSS MCP 2.8 1-2,5² F B ETAME	P60 / A15 / E26	\N	2.5	≥ 200	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
413	1241412-3	270612970	COSS MCP 6.3/4.8K 0,5-1² FB AR	P85 / E27	\N	0.5	≥ 60	3,9 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
414	1241412-3	270612970	COSS MCP 6.3/4.8K 0,5-1² FB AR	P85 / E27	\N	0.75	≥ 85	3,9 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
415	1241412-3	270612970	COSS MCP 6.3/4.8K 0,5-1² FB AR	P85 / E27	\N	1	≥ 140	3,9 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
416	1-962917-1	270612980	COSS MCP 6.3/4.8K 0,5-1² MB AR	P86 / E27	\N	0.5	≥ 60	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
417	1-962917-1	270612980	COSS MCP 6.3/4.8K 0,5-1² MB AR	P86 / E27	\N	0.75	≥ 85	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
418	1-962917-1	270612980	COSS MCP 6.3/4.8K 0,5-1² MB AR	P86 / E27	\N	1	≥ 140	4,7 à 5,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
419	1241414-1	270617270	COSS MCP 6.3/4.8K 1-2,5² F B	???	\N	1	≥ 140	4,4 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
420	1241414-1	270617270	COSS MCP 6.3/4.8K 1-2,5² F B	???	\N	1.5	≥ 150	4,4 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
421	1241414-1	270617270	COSS MCP 6.3/4.8K 1-2,5² F B	???	\N	2.5	≥ 200	4,4 à 5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
422	1241418-4	270610550	COSS MCP 6.3/4.8K 4-6² F B	P63 / E27	\N	4	≥ 310	5,1 à 5,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
423	1241418-4	270610550	COSS MCP 6.3/4.8K 4-6² F B	P63 / E27	\N	6	≥ 450	5,1 à 5,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
424	2-2112966-2	270610570	COSS MCP 6.3/4.8K 4-6² M B	P63 / E27	\N	4	≥ 310	5,7 à 6,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
425	2-2112966-2	270610570	COSS MCP 6.3/4.8K 4-6² M B	P63 / E27	\N	6	≥ 450	5,7 à 6,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
426	1-967590-1	270622820	COSS MCP 9,5 6-10² F	???	\N	6	≥ 350	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
427	1-967590-1	270622820	COSS MCP 9,5 6-10² F	???	\N	10	≥ 500	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
428	963774-1	270622790	COSS MCP 9,5 6-10² M	???	\N	6	???	9,7 à 10,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
429	963774-1	270622790	COSS MCP 9,5 6-10² M	???	\N	10	???	9,7 à 10,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
430	12048159	270626030	COSS METRI-PACK 280 0,5-0,8² M	???	\N	0.5	≥ 80	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
431	12048159	270626030	COSS METRI-PACK 280 0,5-0,8² M	???	\N	0,7,5	≥ 120	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
432	12129493	270625990	COSS METRI-PACK 280 2-3² F	???	\N	2.5	≥ 250	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
433	12129493	270625990	COSS METRI-PACK 280 2-3² F	???	\N	3	≥ 240	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
434	12129497	270626010	COSS METRI-PACK 280 2-3² M	???	\N	2.5	≥ 250	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
435	12129497	270626010	COSS METRI-PACK 280 2-3² M	???	\N	3	≥ 240	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
436	12110853	270624230	COSS METRI-PACK 280 3-5² F	???	\N	2.5	≥ 210	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
437	12110853	270624230	COSS METRI-PACK 280 3-5² F	???	\N	4	≥ 275	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
438	12020156	270616640	COSS METRI-PACK 630 0,5-0,8²	P111	\N	0.5	≥ 80	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
439	12020156	270616640	COSS METRI-PACK 630 0,5-0,8²	P111	\N	0.75	≥ 120	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
440	12066614	270628000	COSS METRI-PACK 630 1-2² FEM	P9	\N	1	≥ 108	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
441	12066614	270628000	COSS METRI-PACK 630 1-2² FEM	P61	\N	2.5	≥ 230	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
442	12052224	270619320	COSS METRI-PACK 630 3² FEM	???	\N	2.5	≥ 250	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
443	12052224	270619320	COSS METRI-PACK 630 3² FEM	???	\N	3	≥ 300	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
444	12052224	270619320	COSS METRI-PACK 630 3² FEM	???	\N	4	≥ 265	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
445	12084590	270619310	COSS METRI-PACK 630 3-5² FEM	???	\N	4	≥ 350	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
446	12084200	270567114	COSS METRI-PACK150 0,3-0,5² F	P7 -P88 / E5-1 - E5-2	\N	0.3	???	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
447	12084200	270567114	COSS METRI-PACK150 0,3-0,5² F	P7 -P88 / E5-1 - E5-2	\N	0.5	???	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
448	12077628	270616600	COSS METRI-PACK150 0,3-0,5² M	???	\N	0.3	≥ 50	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
449	12077628	270616600	COSS METRI-PACK150 0,3-0,5² M	???	\N	0.5	≥ 80	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
450	12048074	270599000	COSS METRI-PACK150 0,5-1² F	P7 - P88 / E5-2 - E5-1	\N	0.5	≥ 75	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
451	12048074	270599000	COSS METRI-PACK150 0,5-1² F	P7 - P88 / E5-2 - E5-1	\N	0.75	≥ 120	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
452	12048074	270599000	COSS METRI-PACK150 0,5-1² F	P7 - P88 / E5-2 - E5-1	\N	1	≥ 160	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
453	15363934	270614380	COSS METRI-PACK150 0,5-1² F B	A25	\N	0.5	≥ 80	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
454	15363934	270614380	COSS METRI-PACK150 0,5-1² F B	A25	\N	0.75	≥ 120	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
455	15363934	270614380	COSS METRI-PACK150 0,5-1² F B	A25	\N	1	≥ 160	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
456	12110236-L	270618590	COSS METRI-PACK150 0,5-1² F V	???	\N	0.5	???	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
457	12110236-L	270618590	COSS METRI-PACK150 0,5-1² F V	???	\N	0.75	≥ 120	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
458	12110236-L	270618590	COSS METRI-PACK150 0,5-1² F V	???	\N	1	≥ 178	4 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
459	12045773	270614110	COSS METRI-PACK150 0,5-1² M	P7 - P88 / E5-2 - E5-1	\N	0.5	≥ 80	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
460	12045773	270614110	COSS METRI-PACK150 0,5-1² M	P7 - P88 / E5-2 - E5-1	\N	0.75	≥ 120	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
461	12045773	270614110	COSS METRI-PACK150 0,5-1² M	P7 - P88 / E5-2 - E5-1	\N	1	≥ 160	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
462	12124076	270625330	COSS METRI-PACK150.2 0,3-0,5²F	P28 (empreinte 20AWG)	\N	0.3	≥ 50	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
463	12124076	270625330	COSS METRI-PACK150.2 0,3-0,5²F	P28 (empreinte 20AWG)	\N	0.5	≥ 80	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
464	12103881	270625170	COSS METRI-PACK150.2 0,8-1² F	???	\N	0.75	≥ 120	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
465	12103881	270625170	COSS METRI-PACK150.2 0,8-1² F	???	\N	1	≥ 160	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
466	12124075	270625340	COSS METRI-PACK150.2 0,8-1² F	P29 (empreinte 16AWG)	\N	0.75	≥ 120	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
467	12124075	270625340	COSS METRI-PACK150.2 0,8-1² F	P29 (empreinte 16AWG)	\N	1	≥ 160	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
468	43030-0010	270619860	COSS MICRO-FIT 0,05-0,1² F V	P137 / E45-1 - E45-2 - E45-3	30	0.05	≥ 6,6	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
469	43030-0010	270619860	COSS MICRO-FIT 0,05-0,1² F V	P137 / E45-1 - E45-2 - E45-3	28	0.08	≥ 8,9	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
470	43030-0010	270619860	COSS MICRO-FIT 0,05-0,1² F V	P137 / E45-1 - E45-2 - E45-3	26	0.12	≥ 13,3	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
471	43030-0001	270624420	COSS MICRO-FIT 0,2-0,5² F B	P137 / A45 / E45-1 - E45-2 - E45-3	24	0.2	≥ 22,2	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
472	43030-0001	270624420	COSS MICRO-FIT 0,2-0,5² F B	P137 / A45 / E45-1 - E45-2 - E45-3	22	0.34	≥ 35,6	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
473	43030-0001	270624420	COSS MICRO-FIT 0,2-0,5² F B	P137 / A45 / E45-1 - E45-2 - E45-3	20	0.5	≥ 57,8	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
474	43030-0008	270568030	COSS MICRO-FIT 0,2-0,5² F V OR	P137 / E45-1 - E45-2 - E45-3	24	0.2	≥ 22,2	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
475	43030-0008	270568030	COSS MICRO-FIT 0,2-0,5² F V OR	P137 / E45-1 - E45-2 - E45-3	22	0.34	≥ 35,6	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
476	43030-0008	270568030	COSS MICRO-FIT 0,2-0,5² F V OR	P137 / E45-1 - E45-2 - E45-3	20	0.5	≥ 57,8	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
477	43031-0001	270624410	COSS MICRO-FIT 0,2-0,5² M B	P137 / A45 / E45-1 - E45-2 - E45-3	24	0.2	≥ 22,2	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
478	43031-0001	270624410	COSS MICRO-FIT 0,2-0,5² M B	P137 / A45 / E45-1 - E45-2 - E45-3	22	0.34	≥ 35,6	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
479	43031-0001	270624410	COSS MICRO-FIT 0,2-0,5² M B	P137 / A45 / E45-1 - E45-2 - E45-3	20	0.5	≥ 57,8	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
480	43031-0007	270624430	COSS MICRO-FIT 0,2-0,5² M V	P137 / E45-1 - E45-2 - E45-3	24	0.2	≥ 22,2	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
481	43031-0007	270624430	COSS MICRO-FIT 0,2-0,5² M V	P137 / E45-1 - E45-2 - E45-3	22	0.34	≥ 35,6	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
482	43031-0007	270624430	COSS MICRO-FIT 0,2-0,5² M V	P137 / E45-1 - E45-2 - E45-3	20	0.5	≥ 57,8	2,54 à 2,92	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
483	794229-1	270610250	COSS MINI M-N-L F 0,35-0,75² V	P54 - P78 / E231	\N	0.35	≥ 48,9	3,2 à 3,71	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
484	794229-1	270610250	COSS MINI M-N-L F 0,35-0,75² V	P54 - P78 / E231	\N	0.5	≥ 57,8	3,2 à 3,71	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
485	794229-1	270610250	COSS MINI M-N-L F 0,35-0,75² V	P54 - P78 / E231	\N	0.75	≥ 66,7	3,2 à 3,71	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
486	794231-1	270610260	COSS MINI M-N-L F 0,5-1,2² V	P54 / E232	\N	0.5	≥ 57,8	3,2 à 3,71	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
487	794231-1	270610260	COSS MINI M-N-L F 0,5-1,2² V	P54 / E232	\N	0.75	≥ 66,7	3,2 à 3,71	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
488	794231-1	270610260	COSS MINI M-N-L F 0,5-1,2² V	P54 / E232	\N	1.2	≥ 80,1	3,2 à 3,71	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
489	794230-1	270610200	COSS MINI M-N-L M 0,5-1,2² V	P54 / E232	\N	0.5	≥ 57,8	3,2 à 3,71	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
490	794230-1	270610200	COSS MINI M-N-L M 0,5-1,2² V	P54 / E232	\N	0.75	≥ 66,7	3,2 à 3,71	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
491	794230-1	270610200	COSS MINI M-N-L M 0,5-1,2² V	P54 / E232	\N	1.2	≥ 80,1	3,2 à 3,71	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
492	39-00-0047	270622010	COSS MINI-FIT 0,08-0,34² FEM V	E19 - E20-1 - E20-2	28	0.08	≥ 9,8	2,79 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
493	39-00-0047	270622010	COSS MINI-FIT 0,08-0,34² FEM V	E19 - E20-1 - E20-2	26	0.1	≥ 19	2,79 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
494	39-00-0047	270622010	COSS MINI-FIT 0,08-0,34² FEM V	E19 - E20-1 - E20-2	24	0.2	≥ 29	2,79 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
495	39-00-0047	270622010	COSS MINI-FIT 0,08-0,34² FEM V	E19 - E20-1 - E20-2	22	0.34	≥ 39	2,79 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
496	39-00-0048	270622960	COSS MINI-FIT 0,08-0,34² MAL V	E19 - E20-1 - E20-2	28	0.08	≥ 9,8	2,79 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
497	39-00-0048	270622960	COSS MINI-FIT 0,08-0,34² MAL V	E19 - E20-1 - E20-2	26	0.1	≥ 19	2,79 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
498	39-00-0048	270622960	COSS MINI-FIT 0,08-0,34² MAL V	E19 - E20-1 - E20-2	24	0.2	≥ 29	2,79 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
499	39-00-0048	270622960	COSS MINI-FIT 0,08-0,34² MAL V	E19 - E20-1 - E20-2	22	0.34	≥ 39	2,79 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
500	39-00-0038	270600600	COSS MINI-FIT 0,25-0,75² FEM B	A46 - PP3 / P17 / E19 - E20-1 - E20-2	24	0.2	≥ 29	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
501	39-00-0038	270600600	COSS MINI-FIT 0,25-0,75² FEM B	A46 - PP3 / P17 / E19 - E20-1 - E20-3	22	0.34	≥ 39	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
502	39-00-0038	270600600	COSS MINI-FIT 0,25-0,75² FEM B	A46 - PP3 / P17 / E19 - E20-1 - E20-4	20	0.5	≥ 59	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
503	39-00-0038	270600600	COSS MINI-FIT 0,25-0,75² FEM B	A46 - PP3 / P17 / E19 - E20-1 - E20-5	18	0.75	≥ 88	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
504	39-00-0040	270614470	COSS MINI-FIT 0,25-0,75² MAL B	A46 - PP3 / P17 / E19 - E20-1 - E20-6	24	0.2	≥ 29	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
505	39-00-0040	270614470	COSS MINI-FIT 0,25-0,75² MAL B	A46 - PP3 / P17 / E19 - E20-1 - E20-7	22	0.34	≥ 39	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
506	39-00-0040	270614470	COSS MINI-FIT 0,25-0,75² MAL B	A46 - PP3 / P17 / E19 - E20-1 - E20-8	20	0.5	≥ 59	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
507	39-00-0040	270614470	COSS MINI-FIT 0,25-0,75² MAL B	A46 - PP3 / P17 / E19 - E20-1 - E20-9	18	0.75	≥ 88	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
508	39-00-0077	270607530	COSS MINI-FIT 1,5² FEM BANDE	P17 / A8 / E19 - E20-1  - E20-2	16	1.5	≥ 88	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
509	39-00-0078	270606970	COSS MINI-FIT 1,5² FEM VRAC	P17 / E19 - E20-1  - E20-2	16	1.5	≥ 88	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
510	39-00-0081	270607540	COSS MINI-FIT 1,5² MAL BANDE	P17 / A8 / E19 - E20-1  - E20-2	16	1.5	≥ 88	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
511	39-00-0082	270607030	COSS MINI-FIT 1,5² MAL VRAC	P17 / E19 - E20-1  - E20-2	16	1.5	≥ 88	3 à 3,3	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
512	926882-1	270567570	COSS M-N-L FEM 0,5-2² B	P31 / A4 / E8 - E8-1 - E8-2 - E8-3 - E16	20	0.5	≥ 58	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
513	926882-1	270567570	COSS M-N-L FEM 0,5-2² B	P31 / A4 / E8 - E8-1 - E8-2 - E8-3 - E16	18	0.8	≥ 89	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
514	926882-1	270567570	COSS M-N-L FEM 0,5-2² B	P31 / A4 / E8 - E8-1 - E8-2 - E8-3 - E16	16	1.3	≥ 134	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
515	926882-1	270567570	COSS M-N-L FEM 0,5-2² B	P31 / A4 / E8 - E8-1 - E8-2 - E8-3 - E16	14	2.1	≥ 223	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
516	350550-1	270607790	COSS M-N-L FEM 0,5-2² V	P31 / E8 - E8-1 - E8-2 - E8-3 - E16	20	0.5	≥ 58	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
517	350550-1	270607790	COSS M-N-L FEM 0,5-2² V	P31 / E8 - E8-1 - E8-2 - E8-3 - E16	18	0.8	≥ 89	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
518	350550-1	270607790	COSS M-N-L FEM 0,5-2² V	P31 / E8 - E8-1 - E8-2 - E8-3 - E16	16	1.3	≥ 134	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
519	350550-1	270607790	COSS M-N-L FEM 0,5-2² V	P31 / E8 - E8-1 - E8-2 - E8-3 - E16	14	2.1	≥ 223	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
520	926893-1	270569970	COSS M-N-L FEM 0,5-2² V	P31 / E8 - E8-1 - E8-2 - E8-3 - E16	20	0.5	≥ 58	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
521	926893-1	270569970	COSS M-N-L FEM 0,5-2² V	P32 / E8 - E8-1 - E8-2 - E8-3 - E16	18	0.8	≥ 89	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
522	926893-1	270569970	COSS M-N-L FEM 0,5-2² V	P33 / E8 - E8-1 - E8-2 - E8-3 - E16	16	1.3	≥ 134	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
523	926893-1	270569970	COSS M-N-L FEM 0,5-2² V	P34 / E8 - E8-1 - E8-2 - E8-3 - E16	14	2.1	≥ 223	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
524	350705-1	270599980	COSS M-N-L MAL 0,5-2² V	P31 / E8 - E8-1 - E8-2 - E8-3 - E16	20	0.5	≥ 58	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
525	350705-1	270599980	COSS M-N-L MAL 0,5-2² V	P31 / E8 - E8-1 - E8-2 - E8-3 - E16	18	0.8	≥ 89	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
526	350705-1	270599980	COSS M-N-L MAL 0,5-2² V	P31 / E8 - E8-1 - E8-2 - E8-3 - E16	16	1.3	≥ 134	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
527	350705-1	270599980	COSS M-N-L MAL 0,5-2² V	P31 / E8 - E8-1 - E8-2 - E8-3 - E16	14	2.1	≥ 223	3,99 à 4,75	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
528	08-70-1031	923922200	COSS MOLEX 08-70-1031 B	P130 / A5	18	\N	≥ 88,2	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
529	08-70-1031	923922200	COSS MOLEX 08-70-1031 B	P130 / A5	20	\N	≥ 58,8	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
530	08-70-1031	923922200	COSS MOLEX 08-70-1031 B	P130 / A5	22	\N	≥ 39,2	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
531	08-70-1031	923922200	COSS MOLEX 08-70-1031 B	P130 / A5	24	\N	≥ 29,4	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
532	08-55-0102	270619890	COSS MOLEX 2759 0,05-0,3²	P129 (POSITION B)	28	0.08	≥ 9,8	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
533	08-55-0102	270619890	COSS MOLEX 2759 0,05-0,3²	P129 (POSITION B)	26	0.12	≥ 19,6	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
534	08-55-0102	270619890	COSS MOLEX 2759 0,05-0,3²	P129 (POSITION B)	24	0.2	≥ 29,4	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
535	08-55-0102	270619890	COSS MOLEX 2759 0,05-0,3²	P129 (POSITION B)	22	0.32	≥ 39,2	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
536	5-965906-1	270609340	COSS MQS 0.6 0,5-0,75² F	P53 / E40	\N	0.5	≥ 60	3,35 à 3,65	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
537	5-965906-1	270609340	COSS MQS 0.6 0,5-0,75² F	P53 / E40	\N	0.75	≥ 85	3,35 à 3,65	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
538	5-963716-1	270614310	COSS MQS 0.6 0,5-0,75² M	P53 / E40	\N	0.5	≥ 60	3,65 à 3,95	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
539	5-963716-1	270614310	COSS MQS 0.6 0,5-0,75² M	P53 / E40	\N	0.75	≥ 85	3,65 à 3,95	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
540	5-962886-1	270626520	COSS MQS 0.6 0.2-0.35² M	??? / E40	\N	0.22	≥ 30	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
541	5-962886-1	270626520	COSS MQS 0.6 0.2-0.35² M	??? / E40	\N	0.35	≥ 50	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
542	1107650	270626110	COSS MTA F800 1,5-2,5² F V	???	\N	1.5	≥ 155	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
543	1107650	270626110	COSS MTA F800 1,5-2,5² F V	???	\N	2.5	≥ 235	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
544	1107940	270627750	COSS MTA UNI 630 CLIP 4-6mm²	P86	\N	4	≥ 310	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
545	175030-1	270614560	COSS MULTILOCK 0,5-1,25² M	P99	\N	0.5	≥ 88,3	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
546	175030-1	270614560	COSS MULTILOCK 0,5-1,25² M	P99	\N	0.85	≥ 127,5	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
547	175030-1	270614560	COSS MULTILOCK 0,5-1,25² M	P99	\N	1.25	≥ 176,5	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
548	345212-1	270617810	COSS MULTILOCK 0,75-1,5² M B	P99	\N	0.75	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
549	345212-1	270617810	COSS MULTILOCK 0,75-1,5² M B	P99	\N	1	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
550	345212-1	270617810	COSS MULTILOCK 0,75-1,5² M B	P99	\N	1.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
551	33012-3004	270618680	COSS MX150 0,35-0,5² F B	P117 - E39	\N	0.35	≥ 50	4,7 à 5,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
552	33012-3004	270618680	COSS MX150 0,35-0,5² F B	P117 - E39	\N	0.5	≥ 75	4,7 à 5,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
553	33001-3006	270616810	COSS MX150 0,35-0,5² F B or	P117 - E39	\N	0.35	≥ 50	4,7 à 5,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
554	33001-3006	270616810	COSS MX150 0,35-0,5² F B or	P117 - E39	\N	0.5	≥ 75	4,7 à 5,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
555	33000-1002	270616840	COSS MX150 0,75-1,25² M B	P116 - E39	\N	0.75	≥ 90	4,7 à 5,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
556	33000-1002	270616840	COSS MX150 0,75-1,25² M B	P116 - E39	\N	1	≥ 120	4,7 à 5,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
557	33000-1002	270616840	COSS MX150 0,75-1,25² M B	P116 - E39	\N	1.25	≥ 135	4,7 à 5,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
558	33012-3002	270616820	COSS MX150 0,75-1² F B	P116 - E39	\N	0.75	≥ 90	4,7 à 5,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
559	33012-3002	270616820	COSS MX150 0,75-1² F B	P116 - E39	\N	1	≥ 120	4,7 à 5,6	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
560	M34S75C4F1	270617400	COSS MX34 0,22-0,35² FEM	P118	\N	0.22	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
561	M34S75C4F1	270617400	COSS MX34 0,22-0,35² FEM	P118	\N	0.34	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
562	M34S75C4F2	270615860	COSS MX34 0,5-0,75² FEM	A27 / E34	\N	0.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
563	M34S75C4F2	270615860	COSS MX34 0,5-0,75² FEM	A27 / E34	\N	0.75	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
564	334670005	270627520	COSS MX64 0,5-0,75² F B	P57 (Avec la deuxième empreinte en partant du bord, qui est de 0,5 à 1,0.)	\N	0.5	>75	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
565	1663394	270619790	COSS PHOE CK 1,5 0,14-0,34² F	P123 / E14 - E23	\N	0.14	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
566	1663394	270619790	COSS PHOE CK 1,5 0,14-0,34² F	P123 / E14 - E23	\N	0.25	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
567	1663394	270619790	COSS PHOE CK 1,5 0,14-0,34² F	P123 / E14 - E23	\N	0.34	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
568	1663336	270619760	COSS PHOE CK 1.5 0,14-0,34² M	P123 / E14 - E23	\N	0.14	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
569	1663336	270619760	COSS PHOE CK 1.5 0,14-0,34² M	P123 / E14 - E23	\N	0.25	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
570	1663336	270619760	COSS PHOE CK 1.5 0,14-0,34² M	P123 / E14 - E23	\N	0.34	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
571	211CC2S1160	270613340	COSS SICMA-3 1.5 0,35-0,75² F	P91 - P87	\N	0.5	≥ 80	4,3 à 4,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
572	211CC2S1160	270613340	COSS SICMA-3 1.5 0,35-0,75² F	P91 - P87	\N	0.75	≥ 140	4,3 à 4,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
573	211CC2S2160P	270623770	COSS SICMA-3 1.5 1,3-2² F	P91 - P87	\N	1	≥ 160	4,3 à 4,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
574	211CC2S2160P	270623770	COSS SICMA-3 1.5 1,3-2² F	P91 - P87	\N	1.5	≥ 200	4,3 à 4,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
575	211CC2S2160P	270623770	COSS SICMA-3 1.5 1,3-2² F	P91 - P87	\N	2	≥ 230	4,3 à 4,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
576	211CL2S2160 / 33512190	270617450	COSS SICMA-3 1.5 1-2 ² M	P87-P91 (Sans positionneur)	\N	1.5	≥ 200	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
577	211CL2S2160 / 33512190	270617450	COSS SICMA-3 1.5 1-2 ² M	P87-P91 (Sans positionneur)	\N	2	≥ 230	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
578	211CC3S2160	270613350	COSS SICMA-3 2.8 1-2,5² F	P93	\N	1.5	≥ 200	4,3 à 4,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
579	211CC3S2160	270613350	COSS SICMA-3 2.8 1-2,5² F	P93	\N	2	≥ 230	4,3 à 4,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
580	211CC3S2160	270613350	COSS SICMA-3 2.8 1-2,5² F	P93	\N	2.5	≥ 250	4,3 à 4,7	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
581	211CL3S2160	270617460	COSS SICMA-3 2.8 1-2,5² M	P89-P93 (Sans positionneur)	\N	1	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
582	211CL3S2160	270617460	COSS SICMA-3 2.8 1-2,5² M	P89-P93 (Sans positionneur)	\N	1.5	≥ 200	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
583	211CL3S2160	270617460	COSS SICMA-3 2.8 1-2,5² M	P89-P93 (Sans positionneur)	\N	2.5	≥ 250	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
584	8656353064LF	270606220	COSS SUB-D 0,2-0,5² FEM	38(SEICER)  /  E15	\N	0.2	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
585	8656353064LF	270606220	COSS SUB-D 0,2-0,5² FEM	38(SEICER)  /  E15	\N	0.34	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
586	8656353064LF	270606220	COSS SUB-D 0,2-0,5² FEM	38(SEICER)  /  E15	\N	0.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
587	8656352064LF	270606240	COSS SUB-D 0,2-0,5² MAL	38(SEICER)  /  E15	\N	0.2	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
588	8656352064LF	270606240	COSS SUB-D 0,2-0,5² MAL	38(SEICER)  /  E15	\N	0.34	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
589	8656352064LF	270606240	COSS SUB-D 0,2-0,5² MAL	38(SEICER)  /  E15	\N	0.5	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
590	282403-1	270567021	COSS SUPERSEAL 0,3-0,5² FEM B	P1 - P2 - P21 - P20 / A1 - A1-1 / E10 - E11 - E111	\N	0.35	≥ 60	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
591	282403-1	270567021	COSS SUPERSEAL 0,3-0,5² FEM B	P1 - P2 - P21 - P20 / A1 - A1-1 / E10 - E11 - E111	\N	0.5	≥ 70	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
592	183035-1	270567020	COSS SUPERSEAL 0,3-0,5² FEM V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	0.35	≥ 60	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
593	183035-1	270567020	COSS SUPERSEAL 0,3-0,5² FEM V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	0.5	≥ 70	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
594	282404-1	270567011	COSS SUPERSEAL 0,3-0,5² MAL B	P1 - P2 - P21 - P20 / A1 - A1-1 / E10 - E11 - E111	\N	0.35	≥ 60	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
595	282404-1	270567011	COSS SUPERSEAL 0,3-0,5² MAL B	P1 - P2 - P21 - P20 / A1 - A1-1 / E10 - E11 - E111	\N	0.5	≥ 70	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
596	183036-1	270567010	COSS SUPERSEAL 0,3-0,5² MAL V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	0.35	≥ 60	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
597	183036-1	270567010	COSS SUPERSEAL 0,3-0,5² MAL V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	0.5	≥ 70	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
598	282110-1	923919100	COSS SUPERSEAL 0,75-1,5² FEM B	P1 - P2 - P21 - P20 / A2 - A2-1 / E10 - E11 - E111	\N	0.75	???	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
599	282110-1	923919100	COSS SUPERSEAL 0,75-1,5² FEM B	P1 - P2 - P21 - P20 / A2 - A2-1 / E10 - E11 - E111	\N	1	≥ 115	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
600	282110-1	923919100	COSS SUPERSEAL 0,75-1,5² FEM B	P1 - P2 - P21 - P20 / A2 - A2-1 / E10 - E11 - E111	\N	1.5	≥ 155	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
601	183025-1	923919000	COSS SUPERSEAL 0,75-1,5² FEM V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	0.75	???	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
602	183025-1	923919000	COSS SUPERSEAL 0,75-1,5² FEM V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	1	≥ 115	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
603	183025-1	923919000	COSS SUPERSEAL 0,75-1,5² FEM V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	1.5	≥ 155	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
604	282109-1	923921000	COSS SUPERSEAL 0,75-1,5² MAL B	P1 - P2 - P21 - P20 / A2 - A2-1 / E10 - E11 - E111	\N	0.75	???	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
605	282109-1	923921000	COSS SUPERSEAL 0,75-1,5² MAL B	P1 - P2 - P21 - P20 / A2 - A2-1 / E10 - E11 - E111	\N	1	≥ 115	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
606	282109-1	923921000	COSS SUPERSEAL 0,75-1,5² MAL B	P1 - P2 - P21 - P20 / A2 - A2-1 / E10 - E11 - E111	\N	1.5	≥ 155	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
607	183024-1	923920000	COSS SUPERSEAL 0,75-1,5² MAL V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	0.75	???	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
608	183024-1	923920000	COSS SUPERSEAL 0,75-1,5² MAL V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	1	≥ 115	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
609	183024-1	923920000	COSS SUPERSEAL 0,75-1,5² MAL V	P1 - P2 - P21 - P20 / E10 - E11 - E111	\N	1.5	≥ 155	3 à 3,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
610	282466-1	270567128	COSS SUPERSEAL 2-2,5² FEM B	P1 - P2 - P21 - P20 (pour section 1.5mm²) et P60 (pour section 2.5mm²) / E10 - E11 - E111	\N	1.5	≥ 155	3,5 à 4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
611	282466-1	270567128	COSS SUPERSEAL 2-2,5² FEM B	P1 - P2 - P21 - P20 (pour section 1.5mm²) et P60 (pour section 2.5mm²) / E10 - E11 - E111	\N	2.5	???	3,5 à 4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
612	282465-1	270599190	COSS SUPERSEAL 2-2,5² MAL B	P1 - P2 - P21 - P20 (pour section 1.5mm²) et P60 (pour section 2.5mm²) / E10 - E11 - E111	\N	1.5	155	3,5 à 4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
613	282465-1	270599190	COSS SUPERSEAL 2-2,5² MAL B	P1 - P2 - P21 - P20 (pour section 1.5mm²) et P60 (pour section 2.5mm²) / E10 - E11 - E111	\N	2.5	???	3,5 à 4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
614	3-1447221-4	270613280	COSS SUPERSEAL1.0 0,5² B	P90 / A34	\N	0.5	≥ 50	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
615	3-1447221-3	270613320	COSS SUPERSEAL1.0 0.75-1.25² B	P107 / A35	\N	0.75	≥ 90	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
616	3-1447221-3	270613320	COSS SUPERSEAL1.0 0.75-1.25² B	P107 / A35	\N	0.85	≥ 110	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
617	3-1447221-3	270613320	COSS SUPERSEAL1.0 0.75-1.25² B	P107 / A35	\N	1.25	???	3,5 à 4,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
618	SC20M-1S31	270609470	COSS TRIM-TRIO 0,35-0,5² FEM B	P39 / E6 - E7	22	0.35	≥ 40	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
619	SC20M-1S31	270609470	COSS TRIM-TRIO 0,35-0,5² FEM B	P39 / E6 - E7	20	0.5	≥ 60	4	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
620	SC16M-1S31	270567111	COSS TRIM-TRIO 0,75-1,5² FEM B	P3 - P24 / A3 / E6 - E7	18	0.8	≥ 90	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
621	SC16M-1S31	270567111	COSS TRIM-TRIO 0,75-1,5² FEM B	P3 - P24 / A3 / E6 - E7	16	1.5	≥ 150	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
622	SC16ML-1D70	270567100	COSS TRIM-TRIO 0,75-1,5² FEM V	P3 - P24 / E6 - E7	18	0.8	≥ 90	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
623	SC16ML-1D70	270567100	COSS TRIM-TRIO 0,75-1,5² FEM V	P3 - P24 / E6 - E7	16	1.5	≥ 150	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
624	SM16M-1S31	270567081	COSS TRIM-TRIO 0,75-1,5² MAL B	P3 - P24 / A3 / E6 - E7	18	0.8	≥ 90	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
625	SM16M-1S31	270567081	COSS TRIM-TRIO 0,75-1,5² MAL B	P3 - P24 / A3 / E6 - E7	16	1.5	≥ 150	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
626	SM16ML-1D70	270567080	COSS TRIM-TRIO 0,75-1,5² MAL V	P3 - P24 / E6 - E7	18	0.8	≥ 90	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
627	SM16ML-1D70	270567080	COSS TRIM-TRIO 0,75-1,5² MAL V	P3 - P24 / E6 - E7	16	1.5	≥ 150	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
628	SC14M1TK6	270612180	COSS TRIM-TRIO 2² FEM B	P3 - P24 / E6 - E7	\N	2	???	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
629	SM14M1TK6	270612660	COSS TRIM-TRIO 2² MAL B	P3 - P24 / E6 - E7	\N	2	???	6.35	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
630	82913607A	270606840	COSS TRIM-TRIO 6² MAL T8	P22 / E1	10	6	???	6,5 à 7,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
631	172773-4	270608590	COSS TYCO MIC 0,5-2²	P34 / E18	22	0.3	≥ 49	3,5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
632	172773-4	270608590	COSS TYCO MIC 0,5-2²	P34 / E18	20	0.5	≥ 88,3	3,5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
633	172773-4	270608590	COSS TYCO MIC 0,5-2²	P34 / E18	18	0.85	≥ 127,3	3,5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
634	172773-4	270608590	COSS TYCO MIC 0,5-2²	P34 / E18	16	1.25	≥ 176,5	3,5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
635	172773-4	270608590	COSS TYCO MIC 0,5-2²	P34 / E18	14	2	≥ 264,8	3,5 à 5,5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
636	2-520103-2	270614220	COSS ULTRA-FAST 0,34-0,75² M	P97	22	0.34	≥ 44,5	6,73 à 7,55	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
637	2-520103-2	270614220	COSS ULTRA-FAST 0,34-0,75² M	P97	20	0.5	≥ 71,2	6,73 à 7,55	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
638	2-520103-2	270614220	COSS ULTRA-FAST 0,34-0,75² M	P97	18	0.75	≥ 89	6,73 à 7,55	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
639	12089188	270600550	COSS WEATHER-PACK 0,5-0,8² FEM	P8 / E3 - E3-1	\N	0.5	≥ 80	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
640	12089188	270600550	COSS WEATHER-PACK 0,5-0,8² FEM	P8 / E3 - E3-1	\N	0.75	≥ 120	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
641	12089040	270600460	COSS WEATHER-PACK 0,5-0,8² MAL	P8 / A26 / E3 - E3-1	\N	0.5	≥ 80	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
642	12089040	270600460	COSS WEATHER-PACK 0,5-0,8² MAL	P8 / A26 / E3 - E3-1	\N	0.75	≥ 120	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
643	12124580	270600560	COSS WEATHER-PACK 1-2² FEM	P8 / E3 - E3-1	\N	1	≥ 160	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
644	12124580	270600560	COSS WEATHER-PACK 1-2² FEM	P8 / E3 - E3-1	\N	1.5	≥ 200	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
645	12124580	270600560	COSS WEATHER-PACK 1-2² FEM	P8 / E3 - E3-1	\N	2	≥ 230	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
646	12124582	270600480	COSS WEATHER-PACK 1-2² MAL	P8 / E3 - E3-1	\N	1	≥ 160	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
647	12124582	270600480	COSS WEATHER-PACK 1-2² MAL	P8 / E3 - E3-1	\N	1.5	≥ 200	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
648	12124582	270600480	COSS WEATHER-PACK 1-2² MAL	P8 / E3 - E3-1	\N	2	≥ 230	4.5	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
649	7116-3250	270623830	COSS YAZ 9,5 5-8² F	UP60 + Mors M1	\N	6	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
650	7116-4103-02	270623840	COSS YAZ YESC 1,5x0,8 0,75-1²	P1 - P103(empreinte 0,5-1²)	\N	0.75	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
651	7116-4103-02	270623840	COSS YAZ YESC 1,5x0,8 0,75-1²	P1 - P103(empreinte 0,5-1²)	\N	1	???	???	\N	2026-04-13 10:36:44.739+01	2026-04-13 10:36:44.739+01
\.


--
-- TOC entry 5714 (class 0 OID 54837)
-- Dependencies: 265
-- Data for Name: curative_maintenance_records; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.curative_maintenance_records (id, incident_date, week_label, intervenant, zone_production, equipement_code, equipement_label, request_time, started_time, finished_time, description_panne, response_minutes, downtime_minutes, "createdAt", "updatedAt", equipement_id) FROM stdin;
1	2025-04-15	KW 16	TAREK	KHUN	Equip 242	Equip 242	10:03	10:08	10:22	REGLAGE TENDEUR + VIS	5.00	14.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
2	2025-04-16	KW 16	TAREK	KHUN	Equip 243	Equip 243	11:23	11:28	11:37	REGLAGE TENDEUR + VIS	5.00	9.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
3	2025-04-17	KW 16	HAMZA	élèctronique	Equip 244	Equip 244	12:16	12:18	12:47	NETOYAGE ET	2.00	29.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
4	2025-04-18	KW 16	HAMZA	élèctronique	Equip 245	Equip 245	13:16	13:18	13:40	\N	2.00	22.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
5	2025-04-19	KW 16	HAMZA	élèctronique	Equip 246	Equip 246	14:16	14:18	14:23	\N	2.00	5.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
6	2025-05-02	KW 18	HAMZA	élèctronique	Equip 247	Equip 247	15:16	15:18	15:27	\N	2.00	9.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
7	2025-05-03	KW 18	HAMZA	élèctronique	Equip 248	Equip 248	16:16	16:18	16:21	\N	2.00	3.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
8	2025-07-04	KW 27	HAMZA	élèctronique	Equip 249	Equip 249	17:16	17:18	17:25	\N	2.00	7.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
9	2025-07-15	KW 29	HAMZA	élèctronique	Equip 250	Equip 250	18:16	18:18	18:20	\N	2.00	2.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
10	2025-06-06	KW 23	HAMZA	élèctronique	Equip 251	Equip 251	19:16	19:18	19:27	\N	2.00	9.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
11	2025-08-23	KW 34	HAMZA	élèctronique	Equip 252	Equip 252	20:16	20:18	20:30	\N	2.00	12.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
12	2025-09-24	KW 39	\N	\N	\N	Non renseigné	21:16	21:11	21:30	\N	1435.00	19.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
13	2025-09-25	KW 39	\N	\N	\N	Non renseigné	22:16	22:18	22:30	\N	2.00	12.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
14	2025-09-26	KW 39	\N	\N	\N	Non renseigné	23:16	23:18	23:39	\N	2.00	21.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
15	2025-09-27	KW 39	\N	\N	\N	Non renseigné	00:16	00:18	00:30	\N	2.00	12.00	2026-04-23 17:31:31.639+01	2026-04-23 17:31:31.639+01	\N
\.


--
-- TOC entry 5688 (class 0 OID 24669)
-- Dependencies: 239
-- Data for Name: ecme_etat; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.ecme_etat (code, designation, marque, n_serie, affectation, necessite_verification, date_derniere_verification, alerte, date_prochaine_verification, date_alerte, remarques, verif_type, "createdAt", "updatedAt") FROM stdin;
ECME002	Microm�tre	MITUTOYO	3621840	Maintenance	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02			2026-02-27 04:36:31.409+01	2026-04-22 14:15:12.305+01
ECME004	Pied � coulisse	MITUTOYO	288841	Electro-aimants	t	2014-06-03	VERIFICATION	2015-06-02	2015-05-03	d�classer  d�finitive (bec casser) 25/11/2014		2026-02-27 04:36:31.413+01	2026-04-22 14:15:12.322+01
ECME005	cale pour EA			Electro-aimants	t	2025-04-15	VALABLE	2026-04-14	2026-03-15			2026-02-27 04:36:31.415+01	2026-04-22 14:15:12.323+01
ECME006	Alimentation stabilis�e		8412201	Contr�le Qualit�	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.417+01	2026-04-22 14:15:12.325+01
ECME007	Banc de test cellule PAEP		2-206	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.419+01	2026-04-22 14:15:12.326+01
ECME008	Multim�tre	FLUKE	74840401	Chauvin Arnoux	t	2025-10-06	VALABLE	2026-10-05	2026-09-05			2026-02-27 04:36:31.42+01	2026-04-22 14:15:12.327+01
ECME009	Multim�tre	FLUKE	74960715	Embases/Relais	t	2025-10-04	VALABLE	2026-10-03	2026-09-03			2026-02-27 04:36:31.422+01	2026-04-22 14:15:12.328+01
ECME010	Multim�tre	FLUKE	74280015	Electronique	t	2025-10-04	VALABLE	2026-10-03	2026-09-03			2026-02-27 04:36:31.425+01	2026-04-22 14:15:12.33+01
ECME011	Multim�tre	FLUKE	74960816	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03			2026-02-27 04:36:31.427+01	2026-04-22 14:15:12.332+01
ECME012	Multim�tre	APPA / 91	00313298	Electronique	t	2025-10-09	VALABLE	2026-10-08	2026-09-08			2026-02-27 04:36:31.428+01	2026-04-22 14:15:12.335+01
ECME013	Multim�tre	APPA / 91	21600644	Electronique	t	2025-10-09	VALABLE	2026-10-08	2026-09-08			2026-02-27 04:36:31.43+01	2026-04-22 14:15:12.339+01
ECME014	Multim�tre	FLUKE	74840412	Bobinage	t	2025-10-09	VALABLE	2026-10-08	2026-09-08			2026-02-27 04:36:31.431+01	2026-04-22 14:15:12.341+01
ECME015	Multim�tre	FLUKE	74270688	Electro-aimants	t	2025-05-24	VALABLE	2026-05-23	2026-04-23			2026-02-27 04:36:31.432+01	2026-04-22 14:15:12.342+01
ECME016	Multim�tre	APPA / 91	06800953	Maintenance	t	\N	INCONNU	\N	\N	empanne (d�classer d�finitive )22/01/2008		2026-02-27 04:36:31.434+01	2026-04-22 14:15:12.343+01
ECME017	Multim�tre	FLUKE / 73	43272114	Maintenance	t	2025-07-05	VALABLE	2026-07-04	2026-06-04			2026-02-27 04:36:31.436+01	2026-04-22 14:15:12.345+01
ECME018	Banc de test 19JU	Banc N�442	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.437+01	2026-04-22 14:15:12.346+01
ECME019	Multim�tre	FLUKE / 85	62380287	Embases/Relais	t	2025-05-24	VALABLE	2026-05-23	2026-04-23			2026-02-27 04:36:31.438+01	2026-04-22 14:15:12.347+01
ECME020	Posons	CORREX / 30g	-----------	Embases/Relais	t	2025-05-23	VALABLE	2026-05-22	2026-04-22			2026-02-27 04:36:31.44+01	2026-04-22 14:15:12.349+01
ECME021	Posons	CORREX / 30g	-----------	Embases/Relais	t	2025-05-23	VALABLE	2026-05-22	2026-04-22			2026-02-27 04:36:31.442+01	2026-04-22 14:15:12.352+01
ECME024	Banc de teste carte SID		Banc N�311	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.445+01	2026-04-22 14:15:12.358+01
ECME025	cale pour EA	7165.11.22.14	�������..	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22			2026-02-27 04:36:31.447+01	2026-04-22 14:15:12.361+01
ECME026	Balance	SARTORIUS / QS 4000	80501252	Electro-aimants	t	2025-03-17	VERIFICATION	2026-03-16	2026-02-14			2026-02-27 04:36:31.449+01	2026-04-22 14:15:12.362+01
ECME027	Multim�tre	FLUKE / 77	74840407	Electro-aimants	t	2025-05-24	VALABLE	2026-05-23	2026-04-23			2026-02-27 04:36:31.453+01	2026-04-22 14:15:12.363+01
ECME028	Multim�tre	FLUKE / 70	75120431	Bobinage	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02			2026-02-27 04:36:31.454+01	2026-04-22 14:15:12.364+01
ECME029	R�glait  50 cm	A R D A		Maintenance	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.455+01	2026-04-22 14:15:12.365+01
ECME030	Balance	METLER / PM34	J16121	Magasin	t	2015-06-15	VERIFICATION	2016-06-14	2016-05-15	retour au client pour d�finitivement		2026-02-27 04:36:31.457+01	2026-04-22 14:15:12.369+01
ECME031	Posons	CORREX / 30g	-----------	Contr�le Qualit�	t	2025-07-05	VALABLE	2026-07-04	2026-06-04			2026-02-27 04:36:31.458+01	2026-04-22 14:15:12.372+01
ECME032	peuson	SOMFY TEC / 50g	10539/3	Chauvin Arnoux	t	2016-12-30	VERIFICATION	2018-12-30	2018-11-30	retour au client d�finitivement 14/07/2017		2026-02-27 04:36:31.459+01	2026-04-22 14:15:12.374+01
ECME033	Banc de test 19JU	n�79.196.21	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.461+01	2026-04-22 14:15:12.375+01
ECME034	Banc de test 19JU	Banc N�228	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.462+01	2026-04-22 14:15:12.375+01
ECME035	Banc de test TMS03	Banc N�187	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.463+01	2026-04-22 14:15:12.377+01
ECME036	cale pour EA	7165102711		Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22			2026-02-27 04:36:31.465+01	2026-04-22 14:15:12.378+01
ECME037	Alimentation stabilis�e	FARNELL / LS60-5	000207	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.466+01	2026-04-22 14:15:12.379+01
ECME038	Alimentation stabilis�e	FARNELL / LS60-5	000206	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.467+01	2026-04-22 14:15:12.38+01
ECME039	Alimentation stabilis�e	FARNELL	000208	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.468+01	2026-04-22 14:15:12.381+01
ECME040	Testeur de carte SI	N� 373	SP401	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.469+01	2026-04-22 14:15:12.381+01
ECME041	Montage de teste  M T I	B B C	11-277	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.47+01	2026-04-22 14:15:12.383+01
ECME042	Banc de teste carte SAM	Banc N�250	250	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.471+01	2026-04-22 14:15:12.39+01
ECME043	Bonc de controle relais	MORS	015438	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.473+01	2026-04-22 14:15:12.393+01
ECME044	Bonc de controle relais	B B C	2034	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.474+01	2026-04-22 14:15:12.394+01
ECME045	peuson 500g	ARPO		Embases/Relais	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.475+01	2026-04-22 14:15:12.396+01
ECME046	peuson 30g	ARPO		Embases/Relais	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.477+01	2026-04-22 14:15:12.397+01
ECME047	Bonc de controle relais	B B C	2071	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.478+01	2026-04-22 14:15:12.398+01
ECME048	Bonc de controle relais	B B C	2073	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.479+01	2026-04-22 14:15:12.399+01
ECME049	Banc r�glage BA	R084		Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.48+01	2026-04-22 14:15:12.405+01
ECME050	Bonc de controle relais	B B C	2136	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.481+01	2026-04-22 14:15:12.407+01
ECME051	Dielectrimetre	RE3000	P5208	Chauvin Arnoux	t	2016-11-03	VERIFICATION	2018-11-02	2018-10-03	retour au client d�finitivement 14/07/2017	IP	2026-02-27 04:36:31.482+01	2026-04-22 14:15:12.409+01
ECME052	Poste de claquage	CDA703	P145802	Chauvin Arnoux	t	2016-11-03	VERIFICATION	2018-11-02	2018-10-03	retour au client d�finitivement 14/07/2017	IP	2026-02-27 04:36:31.484+01	2026-04-22 14:15:12.41+01
ECME053	Multimetre	CDA9651	P342801	Chauvin Arnoux	t	2023-12-20	VERIFICATION	2025-12-19	2025-11-19		IP	2026-02-27 04:36:31.485+01	2026-04-22 14:15:12.412+01
ECME054	Bonc de contr�le	ENERDIS	N0029	Chauvin Arnoux	t	2016-01-14	VERIFICATION	2018-01-13	2017-12-14	retour au client d�finitivement 14/07/2017	IP	2026-02-27 04:36:31.486+01	2026-04-22 14:15:12.413+01
ECME055	Megometre	ISOL 5000N	P3427	Chauvin Arnoux	t	2020-12-21	VERIFICATION	2022-12-20	2022-11-20	retour au client pour v�rification le 24/11/2023	IP	2026-02-27 04:36:31.487+01	2026-04-22 14:15:12.414+01
ECME056	Banc de control	���������	BL 1682	Chauvin Arnoux	t	2023-12-20	VERIFICATION	2025-12-19	2025-11-19		IP	2026-02-27 04:36:31.489+01	2026-04-22 14:15:12.415+01
ECME057	G�n�rateur de claquage	BIPLEX	A,207 - 95567	Electro-aimants	t	2025-07-08	VALABLE	2026-07-07	2026-06-07		IP	2026-02-27 04:36:31.491+01	2026-04-22 14:15:12.419+01
ECME059	Comparateur	MODULAR	000072	Electro-aimants	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02			2026-02-27 04:36:31.496+01	2026-04-22 14:15:12.426+01
ECME060	outil de mesure d'isolement		Banc N�306	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.498+01	2026-04-22 14:15:12.427+01
ECME062	Banc de teste carte SAM	BBC	Banc N�318	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.501+01	2026-04-22 14:15:12.429+01
ECME063	Banc de test	BBC	7920030	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.503+01	2026-04-22 14:15:12.431+01
ECME064	Banc de test	BBC	7145103617	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.504+01	2026-04-22 14:15:12.431+01
ECME065	Banc de contr�le	BBC	E9003	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.504+01	2026-04-22 14:15:12.433+01
ECME066	Comparateur	MODULAR	228180	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.506+01	2026-04-22 14:15:12.436+01
ECME067	Comparateur	MODULAR	515440	Electro-aimants	t	2024-11-03	VERIFICATION	2025-11-02	2025-10-03		IP	2026-02-27 04:36:31.507+01	2026-04-22 14:15:12.437+01
ECME068	Oscilloscops	PM 3540	D02 D1161	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.508+01	2026-04-22 14:15:12.439+01
ECME071	cale pour EA	7145601711	��������.	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.511+01	2026-04-22 14:15:12.442+01
ECME072	Banc de contr�le				f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.513+01	2026-04-22 14:15:12.443+01
ECME073	Comparateur	MITUTOYO	513551	Electro-aimants	t	2024-03-11	VERIFICATION	2025-11-02	2025-10-03		IP	2026-02-27 04:36:31.513+01	2026-04-22 14:15:12.444+01
ECME074	Posons	CORREX / 30g	M-FAB-017	Embases/Relais	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.515+01	2026-04-22 14:15:12.445+01
ECME075	Posons	APRO	M-CQA-020	Contr�le Qualit�	t	2025-07-05	VALABLE	2026-07-04	2026-06-04		IP	2026-02-27 04:36:31.517+01	2026-04-22 14:15:12.446+01
ECME076	Posons	CORREX / 50g	EMR 26	Embases/Relais	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.518+01	2026-04-22 14:15:12.447+01
ECME077	Thermocouple   k.	THERMA 3	-50��..1150�C	Maintenance	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.52+01	2026-04-22 14:15:12.448+01
ECME078	Alimentation stabilis�e	FONTAINE	MT30050 N�479	Chauvin Arnoux	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.521+01	2026-04-22 14:15:12.451+01
ECME079	cale pour EA	7145105111		Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.523+01	2026-04-22 14:15:12.455+01
ECME080	Multimetre CADI 2RMS	3BL8218	P3557	Chauvin Arnoux	t	2018-11-30	VERIFICATION	2020-11-30	2020-10-31	retour au client pour v�rification 11/12/2020	IP	2026-02-27 04:36:31.524+01	2026-04-22 14:15:12.457+01
ECME081	R�glait  50 cm	D F H		Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.526+01	2026-04-22 14:15:12.458+01
ECME082	R�glait  50 cm	D F H		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.526+01	2026-04-22 14:15:12.461+01
ECME083	R�glait  50 cm	D F H		Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.528+01	2026-04-22 14:15:12.461+01
ECME084	R�glait  50 cm	D F H		Bobinage	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.529+01	2026-04-22 14:15:12.462+01
ECME085	R�glait  80 cm	D F H		Contr�le Qualit�	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.531+01	2026-04-22 14:15:12.463+01
ECME086	R�glait  50 cm	D F H		Magasin	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.532+01	2026-04-22 14:15:12.464+01
ECME087	Banc de Test 2820	Banc N�469	------------------	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.532+01	2026-04-22 14:15:12.465+01
ECME088	Testeur c�ble seicer	2 - 001 . 3	������.	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.533+01	2026-04-22 14:15:12.467+01
ECME089	Banc de Test 2820	Banc N�400	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.534+01	2026-04-22 14:15:12.47+01
ECME090	Banc de test / DEVERMINAGE 19JU	Banc N�444	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.535+01	2026-04-22 14:15:12.472+01
ECME091	Banc de test 1732	Banc N�481	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.536+01	2026-04-22 14:15:12.473+01
ECME092	Banc de test 57918011500	Banc N�430	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.536+01	2026-04-22 14:15:12.474+01
ECME093	Banc de test 2453	Banc N�403	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.537+01	2026-04-22 14:15:12.475+01
ECME094	Banc de test OPTIMAGAZ	Banc N�450	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.538+01	2026-04-22 14:15:12.476+01
ECME095	cale pour EA	���������..	�������..	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.539+01	2026-04-22 14:15:12.477+01
ECME096	cale pour EA	7122	��������.	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.54+01	2026-04-22 14:15:12.478+01
ECME097	cale pour EA	���������..	��������.	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.541+01	2026-04-22 14:15:12.479+01
ECME098	cale pour EA	����������	��������..	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.542+01	2026-04-22 14:15:12.48+01
ECME099	cale pour EA	����������	���������.	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.544+01	2026-04-22 14:15:12.481+01
ECME100	cale pour EA	����������.	��������	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.545+01	2026-04-22 14:15:12.482+01
ECME101	cale pour EA	����������.	�������.	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.547+01	2026-04-22 14:15:12.485+01
ECME102	cale pour EA	���������	7122103812	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.548+01	2026-04-22 14:15:12.487+01
ECME103	cale pour EA	��������..	������	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.549+01	2026-04-22 14:15:12.489+01
ECME104	cale pour EA	���������..	�������	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.55+01	2026-04-22 14:15:12.49+01
ECME105	cale pour EA	���������	�������..	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.551+01	2026-04-22 14:15:12.491+01
ECME106	cale pour EA	��������..	�������..	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.552+01	2026-04-22 14:15:12.493+01
ECME108	cale pour EA	���������	�������.	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.555+01	2026-04-22 14:15:12.495+01
ECME109	cale pour EA	�������..	�������	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.556+01	2026-04-22 14:15:12.496+01
ECME110	cale pour EA	��������..	������.	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.557+01	2026-04-22 14:15:12.497+01
ECME111	cale pour EA	���������	7122103611	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.558+01	2026-04-22 14:15:12.498+01
ECME112	cale pour EA	��������.	������	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.56+01	2026-04-22 14:15:12.501+01
ECME114	cale pour EA	��������.	�����.	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.563+01	2026-04-22 14:15:12.506+01
ECME115	testeur de couple	DESOUTTER	6GP024882	Embases/Relais	t	2025-07-05	VALABLE	2026-07-04	2026-06-04		IP	2026-02-27 04:36:31.564+01	2026-04-22 14:15:12.507+01
ECME116	G�n�rateur de claquage	RIGIDITEST	CDA703	Chauvin Arnoux	t	2025-10-09	VALABLE	2026-10-08	2026-09-08		IP	2026-02-27 04:36:31.565+01	2026-04-22 14:15:12.508+01
ECME117	G�n�rateur de claquage	BIPLEX	A207N�93915	Electro-aimants	t	2024-11-03	VERIFICATION	2025-11-02	2025-10-03		IP	2026-02-27 04:36:31.567+01	2026-04-22 14:15:12.51+01
ECME118	Multim�tre	FLUKE 117	N 10140	Contr�le Qualit�	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02		IP	2026-02-27 04:36:31.568+01	2026-04-22 14:15:12.511+01
ECME120	Balance de pr�cision	Mettler / PL601-S	1128451278	Magasin	t	2025-03-17	VERIFICATION	2026-03-16	2026-02-14		IP	2026-02-27 04:36:31.57+01	2026-04-22 14:15:12.513+01
ECME121	Pied � coulisse	Stainless	F139623	Contr�le Qualit�	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.572+01	2026-04-22 14:15:12.514+01
ECME123	testeur de couple	FACOM	P5695	Chauvin Arnoux	t	2025-01-09	VALABLE	2027-01-08	2026-12-09		IP	2026-02-27 04:36:31.575+01	2026-04-22 14:15:12.518+01
ECME124	pince amp�rem�trique	FLUKE	T5-600	Maintenance	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02		IP	2026-02-27 04:36:31.576+01	2026-04-22 14:15:12.52+01
ECME125	poste de contr�le c�blage 9705			Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.577+01	2026-04-22 14:15:12.522+01
ECME126	poste de contr�le c�blage 9946			Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.578+01	2026-04-22 14:15:12.523+01
ECME127	Banc r�glage BD	R 260		Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.579+01	2026-04-22 14:15:12.524+01
ECME128	Banc r�glage BD	R 261		Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.58+01	2026-04-22 14:15:12.525+01
ECME129	Banc r�glage BA / CA /CA de base	R 259		Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.581+01	2026-04-22 14:15:12.525+01
ECME130	Battage	R 074		Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.582+01	2026-04-22 14:15:12.526+01
ECME131	Banc r�glage BA / CA /CA de base	R 072		Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.583+01	2026-04-22 14:15:12.527+01
ECME132	Banc aimantation BA	TYPE 15100	87	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.584+01	2026-04-22 14:15:12.528+01
ECME133	R�glait  50 cm	D F H		Contr�le Qualit�	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.585+01	2026-04-22 14:15:12.529+01
ECME134	R�glait  50 cm	D F H		Chauvin Arnoux	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.586+01	2026-04-22 14:15:12.529+01
ECME135	Banc r�glage CA			Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.587+01	2026-04-22 14:15:12.53+01
ECME136	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.588+01	2026-04-22 14:15:12.531+01
ECME137	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.589+01	2026-04-22 14:15:12.533+01
ECME138	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.59+01	2026-04-22 14:15:12.536+01
ECME139	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.591+01	2026-04-22 14:15:12.538+01
ECME140	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.592+01	2026-04-22 14:15:12.539+01
ECME141	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.593+01	2026-04-22 14:15:12.541+01
ECME142	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.594+01	2026-04-22 14:15:12.542+01
ECME143	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.595+01	2026-04-22 14:15:12.543+01
ECME144	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.596+01	2026-04-22 14:15:12.544+01
ECME145	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.597+01	2026-04-22 14:15:12.545+01
ECME146	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.598+01	2026-04-22 14:15:12.546+01
ECME147	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.599+01	2026-04-22 14:15:12.547+01
ECME148	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.6+01	2026-04-22 14:15:12.548+01
ECME149	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.601+01	2026-04-22 14:15:12.551+01
ECME150	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.602+01	2026-04-22 14:15:12.555+01
ECME151	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.603+01	2026-04-22 14:15:12.557+01
ECME152	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.604+01	2026-04-22 14:15:12.558+01
ECME154	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.606+01	2026-04-22 14:15:12.562+01
ECME155	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.607+01	2026-04-22 14:15:12.563+01
ECME156	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.608+01	2026-04-22 14:15:12.564+01
ECME157	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.609+01	2026-04-22 14:15:12.567+01
ECME158	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.611+01	2026-04-22 14:15:12.57+01
ECME159	mesureur de temp�rature	ERSA	-50�.+1150�C	Maintenance	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.612+01	2026-04-22 14:15:12.572+01
ECME160	cale pour EA			Electro-aimants	t	2024-11-21	VERIFICATION	2025-11-20	2025-10-21		IP	2026-02-27 04:36:31.613+01	2026-04-22 14:15:12.573+01
ECME161	cale pour EA			Electro-aimants	t	2024-11-21	VERIFICATION	2025-11-20	2025-10-21		IP	2026-02-27 04:36:31.614+01	2026-04-22 14:15:12.574+01
ECME162	cale pour EA			Electro-aimants	t	2024-11-21	VERIFICATION	2025-11-20	2025-10-21		IP	2026-02-27 04:36:31.616+01	2026-04-22 14:15:12.576+01
ECME163	Tampon filet�	M4 6H	20640069	Electro-aimants	t	2024-11-03	VERIFICATION	2025-11-02	2025-10-03		IP	2026-02-27 04:36:31.617+01	2026-04-22 14:15:12.577+01
ECME165	cale pour EA			Electro-aimants	t	2025-01-04	VERIFICATION	2026-01-03	2025-12-04		IP	2026-02-27 04:36:31.62+01	2026-04-22 14:15:12.579+01
ECME166	cale pour EA			Electro-aimants	t	2025-01-04	VERIFICATION	2026-01-03	2025-12-04		IP	2026-02-27 04:36:31.621+01	2026-04-22 14:15:12.581+01
ECME167	Masse �talant des ventouses 7951	05486-01	18,04g	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.622+01	2026-04-22 14:15:12.582+01
ECME168	Masse �talant des ventouses 7952	05485-02	17,92g	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.623+01	2026-04-22 14:15:12.585+01
ECME169	Cale d'entre grain			Embases/Relais	t	2025-07-02	VALABLE	2026-07-01	2026-06-01		IP	2026-02-27 04:36:31.625+01	2026-04-22 14:15:12.587+01
ECME170	Banc de test groom		Banc N�524	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.626+01	2026-04-22 14:15:12.589+01
ECME171	Multim�tre	DVM 1100	va 090624565	m�thode	t	2020-05-13	VERIFICATION	2021-05-12	2021-04-12	d�classer d�finitive  2021	IP	2026-02-27 04:36:31.626+01	2026-04-22 14:15:12.59+01
ECME173	Banc de r�glage	BA 72 Z 26 AD	R264	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.628+01	2026-04-22 14:15:12.592+01
ECME174	Almentation stabilisee	METCIX   AX 331	5.1006	Chauvin Arnoux	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.629+01	2026-04-22 14:15:12.592+01
ECME176	Dielectrimetre	PC6 DB	508	Electro-aimants	t	2018-11-22	VERIFICATION	2019-11-21	2019-10-22	l'instrument et non-conforme d�classer 29/11/2018	IP	2026-02-27 04:36:31.631+01	2026-04-22 14:15:12.595+01
ECME177	Tampon filet�	M4 6H	29710225	Contr�le Qualit�	t	2024-11-03	VERIFICATION	2025-11-02	2025-10-03		IP	2026-02-27 04:36:31.632+01	2026-04-22 14:15:12.596+01
ECME178	Tampon filet�	M3 6H	30817039	Contr�le Qualit�	t	2024-11-03	VERIFICATION	2025-11-02	2025-10-03		IP	2026-02-27 04:36:31.632+01	2026-04-22 14:15:12.597+01
ECME179	Multim�tre	Agilent U1242B	10149	Contr�le Qualit�	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.634+01	2026-04-22 14:15:12.6+01
ECME180	Oscilloscops	Iso-tech	028A074G2	Electronique	t	2025-10-06	VALABLE	2026-10-05	2026-09-05		IP	2026-02-27 04:36:31.634+01	2026-04-22 14:15:12.604+01
ECME181	Milli-ohmmetr	CROPICO	4000	Electro-aimants	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02		IP	2026-02-27 04:36:31.635+01	2026-04-22 14:15:12.606+01
ECME182	Banc de test (TM 255 )	Banc N�205	57982025B	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.636+01	2026-04-22 14:15:12.607+01
ECME183	Banc de test du varioface	f-so 1234		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.637+01	2026-04-22 14:15:12.609+01
ECME186	mesureur de temp�rature	RS PRO	408-6109	administrative	t	2022-10-20	VERIFICATION	2023-10-19	2023-09-19	d�classer  d�finitive 2023	IP	2026-02-27 04:36:31.64+01	2026-04-22 14:15:12.612+01
ECME188	Alimentation stabilises	ROVA	CVT 250	Chauvin Arnoux	t	2013-05-27	VERIFICATION	2015-05-26	2015-04-26	retour pour v�refication 05/06/2015	IP	2026-02-27 04:36:31.642+01	2026-04-22 14:15:12.613+01
ECME189	Milli-ohmmetr	TT I	RS284-8056	Electro-aimants	t	2025-05-24	VALABLE	2026-05-23	2026-04-23		IP	2026-02-27 04:36:31.643+01	2026-04-22 14:15:12.615+01
ECME190	cale pour EA	EP 25	EA7165119111	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.644+01	2026-04-22 14:15:12.617+01
ECME191	Banc de test (AS amplifier )	Banc N�518	57818002100	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.645+01	2026-04-22 14:15:12.62+01
ECME192	Banc de test carte de gestion portes	57121004	Banc N�537	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.646+01	2026-04-22 14:15:12.621+01
ECME193	Banc de test des ralonges superseal		E028	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.647+01	2026-04-22 14:15:12.622+01
ECME194	Dielectrimetre	MPC 46 P	138	Contr�le Qualit�	t	2024-09-12	VERIFICATION	2025-09-11	2025-08-12	retour au client pour repparation le08/02/2025	IP	2026-02-27 04:36:31.648+01	2026-04-22 14:15:12.623+01
ECME195	cale pour EA			Electro-aimants	t	2025-03-12	VERIFICATION	2026-03-11	2026-02-09		IP	2026-02-27 04:36:31.649+01	2026-04-22 14:15:12.624+01
ECME196	cale pour EA			Electro-aimants	t	2025-03-12	VERIFICATION	2026-03-11	2026-02-09		IP	2026-02-27 04:36:31.65+01	2026-04-22 14:15:12.626+01
ECME197	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.651+01	2026-04-22 14:15:12.627+01
ECME198	Microm�tre	ROCH PARIS	PL07	Maintenance	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.652+01	2026-04-22 14:15:12.627+01
ECME199	posons	SOMFY TEC / 5000g	15244	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.653+01	2026-04-22 14:15:12.628+01
ECME200	Matrice pour sertissage des broches			Electro-aimants	t	2013-08-26	DECLASSE	\N	\N	Declasser	IP	2026-02-27 04:36:31.654+01	2026-04-22 14:15:12.629+01
ECME201	Matrice pour sertissage des broches			Electro-aimants	t	2013-08-26	DECLASSE	\N	\N	Declasser	IP	2026-02-27 04:36:31.654+01	2026-04-22 14:15:12.63+01
ECME202	Alimentation stabilis�e	elc	99/04877	Chauvin Arnoux	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.655+01	2026-04-22 14:15:12.631+01
ECME203	Alimentation stabilis�e	elc	99/04723	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.656+01	2026-04-22 14:15:12.632+01
ECME204	Alimentation stabilis�e	elc	00/06104	Maintenance	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.657+01	2026-04-22 14:15:12.634+01
ECME205	Banc de test groom		512/01	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.658+01	2026-04-22 14:15:12.636+01
ECME206	Pied � coulisse	DIGITAL CALIPER	LIN74080656	Chauvin Arnoux	t	2023-12-13	VERIFICATION	2025-12-12	2025-11-12			2026-02-27 04:36:31.658+01	2026-04-22 14:15:12.637+01
ECME207	Banc de test du tempo 'F' de blocage		Banc N� 511	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.659+01	2026-04-22 14:15:12.639+01
ECME208	Alimentation stabilis�e	2603270892	EA-PS 2084-05B	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.66+01	2026-04-22 14:15:12.64+01
ECME209	Alimentation stabilis�e	2603270977	EA-PS-2084-05B	Electro-aimants	f	2013-05-29	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.661+01	2026-04-22 14:15:12.641+01
ECME210	Banc de test cable KUHN	KT 210	1206K210199	KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.662+01	2026-04-22 14:15:12.642+01
ECME211	Banc de test cartes silxxx	seicer		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.663+01	2026-04-22 14:15:12.643+01
ECME212	Banc de test carte varate			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.664+01	2026-04-22 14:15:12.644+01
ECME213	Banc de teste boitiers LDPM		N� 541	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.665+01	2026-04-22 14:15:12.645+01
ECME214	Ensemble de pression	P520801		Chauvin Arnoux	t	2013-09-17	INCONNU	\N	\N		IP	2026-02-27 04:36:31.667+01	2026-04-22 14:15:12.646+01
ECME215	Testeur de rallonges 2&3 p�les		9160630	KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.668+01	2026-04-22 14:15:12.647+01
ECME216	Tournevis Dynamom�trique	SWISS TOOLS	201718/903	Electronique	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.669+01	2026-04-22 14:15:12.648+01
ECME218	Banc test KFAI0000004A	TEC		KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.671+01	2026-04-22 14:15:12.659+01
ECME219	Banc de test KFAI0000006A / 5A	TEC		KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.672+01	2026-04-22 14:15:12.663+01
ECME220	Accessoire de test haute		P520801	Chauvin Arnoux	t	2016-11-03	VERIFICATION	2018-11-02	2018-10-03	retour au client d�finitivement 14/07/2017	IP	2026-02-27 04:36:31.674+01	2026-04-22 14:15:12.664+01
ECME221	Banc de test 57321006		Banc N� 564	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.675+01	2026-04-22 14:15:12.665+01
ECME222	Pied � coulisse	FORMAT	14001949	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.676+01	2026-04-22 14:15:12.668+01
ECME223	Banc de test de la carte serrure	57431004000	Banc N� 572	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.677+01	2026-04-22 14:15:12.673+01
ECME224	Banc de contr�le socomec	LF248B	524S00708	Contr�le Qualit�	t	2025-10-01	VALABLE	2026-09-29	2026-08-30		IP	2026-02-27 04:36:31.678+01	2026-04-22 14:15:12.675+01
ECME225	Alimentation stabilis�e	BK precision	9110	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.679+01	2026-04-22 14:15:12.676+01
ECME226	outil de v�rification de la cote 50,9mm de EA 71845773530		79,215,02	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.68+01	2026-04-22 14:15:12.677+01
ECME227	cale pour EA 71733723060			Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.681+01	2026-04-22 14:15:12.678+01
ECME228	Multim�tre	Temphaser	1500109	Electro-aimants	t	2025-05-24	VALABLE	2026-05-23	2026-04-23		IP	2026-02-27 04:36:31.681+01	2026-04-22 14:15:12.679+01
ECME229	Multim�tre	Temphaser	1500107	Bobinage	t	2025-07-05	VALABLE	2026-07-04	2026-06-04		IP	2026-02-27 04:36:31.683+01	2026-04-22 14:15:12.68+01
ECME230	Multim�tre	Temphaser	1500110	Electronique	t	2025-07-05	VALABLE	2026-07-04	2026-06-04		IP	2026-02-27 04:36:31.684+01	2026-04-22 14:15:12.681+01
ECME232	Multim�tre	Temphaser	1500101	Maintenance	t	2025-07-05	VALABLE	2026-07-04	2026-06-04		IP	2026-02-27 04:36:31.686+01	2026-04-22 14:15:12.685+01
ECME233	Mesureur de force d'extraction	komax	332,0267	Contr�le Qualit�	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02		IP	2026-02-27 04:36:31.687+01	2026-04-22 14:15:12.687+01
ECME235	Alimentation stabilis�e	BK precision	9110	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.689+01	2026-04-22 14:15:12.69+01
ECME236	Multimetre de table	TENMA 72-1016	H150800508	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.69+01	2026-04-22 14:15:12.691+01
ECME237	Alimentation	EA 09200128	1465310001	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.691+01	2026-04-22 14:15:12.692+01
ECME238	Comparateur numerique	MITUTOYO	15160502	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.691+01	2026-04-22 14:15:12.692+01
ECME239	Banc de control	SOCOMEC		Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.693+01	2026-04-22 14:15:12.693+01
ECME240	Banc de control	MITUTOYO	79.216.01	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.694+01	2026-04-22 14:15:12.695+01
ECME241	cale pour EA		79.216.04	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.696+01	2026-04-22 14:15:12.696+01
ECME242	Cale pour EA 71733723060			Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.696+01	2026-04-22 14:15:12.697+01
ECME001	Pied � coulisse	MITUTOYO	7C3857	Maintenance	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02			2026-02-27 04:36:31.401+01	2026-04-22 14:15:12.291+01
ECME022	Banc de test TMS01	Banc N�271	TEC	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.443+01	2026-04-22 14:15:12.355+01
ECME058	Comparateur	MODULAR	230868	Electro-aimants	t	2024-11-03	VERIFICATION	2025-11-02	2025-10-03		IP	2026-02-27 04:36:31.493+01	2026-04-22 14:15:12.422+01
ECME107	cale pour EA	��������.	�������..	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.554+01	2026-04-22 14:15:12.494+01
ECME113	cale pour EA	��������.	7165112514	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.562+01	2026-04-22 14:15:12.504+01
ECME122	Detecteur de tension		P408802	Chauvin Arnoux	t	2013-05-27	VERIFICATION	2015-05-26	2015-04-26	retour pour v�refication 05/06/2015	IP	2026-02-27 04:36:31.574+01	2026-04-22 14:15:12.515+01
ECME164	Tampon filet�	M3 6H		Electro-aimants	t	2024-11-03	VERIFICATION	2025-11-02	2025-10-03	d�classer d�finitive non conforme le 02/11/2024	IP	2026-02-27 04:36:31.618+01	2026-04-22 14:15:12.578+01
ECME175	cale pour EA			Electro-aimants	t	2024-11-21	VERIFICATION	2025-11-20	2025-10-21		IP	2026-02-27 04:36:31.63+01	2026-04-22 14:15:12.593+01
ECME185	Banc de test pour produit 57011006400		Banc N�528	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.639+01	2026-04-22 14:15:12.611+01
ECME231	Multim�tre	Temphaser	1500105	Embases/Relais	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.685+01	2026-04-22 14:15:12.683+01
ECME234	Alimentation stabilis�e	BK precision	9110	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.688+01	2026-04-22 14:15:12.689+01
ECME243	Multim�tre	Temphaser	1500820	KUHN	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.697+01	2026-04-22 14:15:12.698+01
ECME244	Banc de test			KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.698+01	2026-04-22 14:15:12.699+01
ECME245	Alimentation	EA 09200128	1468370001	KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.699+01	2026-04-22 14:15:12.703+01
ECME246	Cale pour 7122BE et 7R25BMT			Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.699+01	2026-04-22 14:15:12.706+01
ECME247	Dielectrimetre	Slaughter  2975	3390960	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.7+01	2026-04-22 14:15:12.707+01
ECME248	Banc de test	THERMOSONDE	N�555	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.701+01	2026-04-22 14:15:12.709+01
ECME249	Pied � coulisse	MITUTOYO	B16018234	Maintenance	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.702+01	2026-04-22 14:15:12.711+01
ECME250	Balance	9860.3	98,30,0206	Magasin	t	2025-03-17	VERIFICATION	2026-03-16	2026-02-14		IP	2026-02-27 04:36:31.703+01	2026-04-22 14:15:12.711+01
ECME251	Pied � coulisse	Stainless	GX16050991	Maintenance	t	2025-07-05	VALABLE	2026-07-04	2026-06-04		IP	2026-02-27 04:36:31.704+01	2026-04-22 14:15:12.712+01
ECME252	mesureur de temp�rature	RS PRO	408-6109	Bobinage	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.706+01	2026-04-22 14:15:12.713+01
ECME253	mesureur de temp�rature	RS PRO	408-6109	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.707+01	2026-04-22 14:15:12.714+01
ECME254	Multim�tre	FLUK 175	37500484	Electro-aimants	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02		IP	2026-02-27 04:36:31.708+01	2026-04-22 14:15:12.718+01
ECME255	Multim�tre	FLUK 175	37500590	KUHN	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02		IP	2026-02-27 04:36:31.709+01	2026-04-22 14:15:12.721+01
ECME256	Multim�tre	Chauvin arnoux	P6049	Chauvin Arnoux	t	2018-05-29	VERIFICATION	2019-05-28	2019-04-28	retour au client pour v�rification11/05/2018	IP	2026-02-27 04:36:31.71+01	2026-04-22 14:15:12.722+01
ECME257	Cale pour EA		71651134150	Electro-aimants	t	2024-11-23	VERIFICATION	2025-11-22	2025-10-23		IP	2026-02-27 04:36:31.711+01	2026-04-22 14:15:12.723+01
ECME258	Banc de test des ralonges superseal	Marlanvil		KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.711+01	2026-04-22 14:15:12.724+01
ECME259	Cale d'entre grain			Embases/Relais	t	2025-03-12	VERIFICATION	2026-03-11	2026-02-09		IP	2026-02-27 04:36:31.712+01	2026-04-22 14:15:12.725+01
ECME260	Cale d'entre grain			Contr�le Qualit�	t	2025-03-12	VERIFICATION	2026-03-11	2026-02-09		IP	2026-02-27 04:36:31.713+01	2026-04-22 14:15:12.726+01
ECME261	Pied � coulisse	MITUTOYO	M-CQA-031	Contr�le Qualit�	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.714+01	2026-04-22 14:15:12.727+01
ECME262	mesureur de temp�rature	RS PRO	408-6109	Contr�le Qualit�	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.715+01	2026-04-22 14:15:12.728+01
ECME263	mesureur de temp�rature	RS PRO	408-6109	Embases/Relais	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.716+01	2026-04-22 14:15:12.729+01
ECME264	Banc de test pour carte afficheur	ND3890		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.718+01	2026-04-22 14:15:12.729+01
ECME265	Pied � coulisse	Stainless	GX17118803	Contr�le Qualit�	t	2024-11-02	VERIFICATION	2025-11-02	2025-10-03		IP	2026-02-27 04:36:31.719+01	2026-04-22 14:15:12.73+01
ECME266	Balance	Metler / T820 /PE24	C89477	Magasin	t	2025-03-17	VERIFICATION	2026-03-16	2026-02-14		IP	2026-02-27 04:36:31.72+01	2026-04-22 14:15:12.731+01
ECME267	Alimentation stabilis�e	SODILEC	376650	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.721+01	2026-04-22 14:15:12.734+01
ECME268	Alimentation stabilis�e	ELC	95/00335	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.722+01	2026-04-22 14:15:12.736+01
ECME269	Alimentation stabilis�e	ELC	97/02919	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.723+01	2026-04-22 14:15:12.738+01
ECME271	Banc de test caterpillar	55181101100	N�449	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.725+01	2026-04-22 14:15:12.74+01
ECME273	dielectrique AC	SCI 00295	3423239	Electro-aimants	t	2025-10-04	VALABLE	2026-10-03	2026-09-03		IP	2026-02-27 04:36:31.726+01	2026-04-22 14:15:12.742+01
ECME274	Cale pour EA 92-19-61-20		79-219-31	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.727+01	2026-04-22 14:15:12.743+01
ECME275	Multimetre	P6481	A5273	Chauvin Arnoux	t	2025-01-06	VERIFICATION	2026-01-05	2025-12-06		IP	2026-02-27 04:36:31.728+01	2026-04-22 14:15:12.744+01
ECME276	Banc de test PCBA	101006-101016-600106	20190424	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.729+01	2026-04-22 14:15:12.745+01
ECME277	Banc de test produit final	101006-101016-600106	2019-04-20	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.73+01	2026-04-22 14:15:12.746+01
ECME278	Banc de programation des modules chauffage	101006-101016-600106		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.731+01	2026-04-22 14:15:12.746+01
ECME279	Banc de test panol autodef	N�405		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.731+01	2026-04-22 14:15:12.747+01
ECME280	Banc de test carte .DSM5002	56190001100		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.732+01	2026-04-22 14:15:12.748+01
ECME281	testeur ESD	3M     715E	03529	Electronique	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02		IP	2026-02-27 04:36:31.733+01	2026-04-22 14:15:12.75+01
ECME282	Banc de test  boitier Hummbox US LC			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.734+01	2026-04-22 14:15:12.752+01
ECME283	Tournevis Dynamom�trique	GEDORE	5jt000699	Electronique	t	2024-12-12	VERIFICATION	2025-12-11	2025-11-11		IP	2026-02-27 04:36:31.734+01	2026-04-22 14:15:12.754+01
ECME284	Tournevis Dynamom�trique	GEDORE	5KT001207	Electronique	t	2024-12-12	VERIFICATION	2025-12-11	2025-11-11		IP	2026-02-27 04:36:31.735+01	2026-04-22 14:15:12.756+01
ECME285	Banc de test faisceau 83233137			KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.736+01	2026-04-22 14:15:12.757+01
ECME286	Banc de test carte de base AY012020	B&C	BC125	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.737+01	2026-04-22 14:15:12.758+01
ECME287	Banc de test carte afficheur AY012020			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.738+01	2026-04-22 14:15:12.76+01
ECME003	Comparateur	MITUTOYO	0015188	Maintenance	t	2024-11-02	VERIFICATION	2025-11-01	2025-10-02			2026-02-27 04:36:31.411+01	2026-04-22 14:15:12.307+01
ECME023	Tension meter	DTMB - 500 - G	G 570 - 06068	Bobinage	t	2016-11-25	VERIFICATION	2017-11-24	2017-10-25	d�classer d�finitive (non-conforme) 2/12/2016		2026-02-27 04:36:31.444+01	2026-04-22 14:15:12.357+01
ECME061	cale pour EA	7323	��������	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.499+01	2026-04-22 14:15:12.428+01
ECME069	Banc de test SORTIE SORELL	TEC	Banc N�280	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.509+01	2026-04-22 14:15:12.44+01
ECME070	G�n�rateur de claquage	BIPLEX	A507 - 96003	Electro-aimants	t	2016-11-26	VERIFICATION	2017-11-25	2017-10-26	d�classer  d�finitive (non conforme) 2/12/2016	IP	2026-02-27 04:36:31.51+01	2026-04-22 14:15:12.441+01
ECME119	cale pour EA	��������	�����..	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.569+01	2026-04-22 14:15:12.512+01
ECME153	Cale d'entre grain			Embases/Relais	t	2025-10-31	VALABLE	2026-10-30	2026-09-30		IP	2026-02-27 04:36:31.605+01	2026-04-22 14:15:12.56+01
ECME172	Banc de r�glage	BA 72 Z 26 AD	R263	Contr�le Qualit�	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.627+01	2026-04-22 14:15:12.591+01
ECME184	Banc de test pour produit 57033008000		Banc N�529	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.638+01	2026-04-22 14:15:12.61+01
ECME217	Banc de contr�le 79R2DS40DT		N� 558	Embases/Relais	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.67+01	2026-04-22 14:15:12.651+01
ECME270	Banc de test carte cabl�e codeur RM3			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.724+01	2026-04-22 14:15:12.74+01
ECME272	Banc de test cabine peinture	57418008300PC	N�510	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.726+01	2026-04-22 14:15:12.741+01
ECME288	Banc de test 004	K3121681 /K3120600		KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.739+01	2026-04-22 14:15:12.761+01
ECME289	Multimetre	DT9205A		KUHN	t	2024-11-06	VERIFICATION	2025-11-05	2025-10-06		IP	2026-02-27 04:36:31.741+01	2026-04-22 14:15:12.762+01
ECME290	Banc de test cable TEDS		388338	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.742+01	2026-04-22 14:15:12.763+01
ECME291	Banc de test (interface de test 008 )	K3652850 / K3652860		KUHN	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.743+01	2026-04-22 14:15:12.764+01
ECME292	Multimetre	Red Line 125S	2100419	KUHN	t	2024-11-06	VERIFICATION	2025-11-05	2025-10-06		IP	2026-02-27 04:36:31.744+01	2026-04-22 14:15:12.765+01
ECME293	Couple m�tre	MET-NET 24	5LV059802	Electronique	t	2023-04-18	VERIFICATION	2024-04-17	2024-03-18	retour au client pour v�rification 03/05/2024	IP	2026-02-27 04:36:31.746+01	2026-04-22 14:15:12.766+01
ECME294	Couple m�tre	MET-NET 23	5JV000329	Electronique	t	2023-04-18	VERIFICATION	2024-04-17	2024-03-18	retour au client pour v�rification 03/05/2024	IP	2026-02-27 04:36:31.747+01	2026-04-22 14:15:12.769+01
ECME295	Tampon filet�	M3-GH	2154395	Electro-aimants	t	2025-05-23	VALABLE	2026-05-22	2026-04-22		IP	2026-02-27 04:36:31.747+01	2026-04-22 14:15:12.771+01
ECME296	Banc de test pour 5619100600	SW-00150300-S10		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	IP	2026-02-27 04:36:31.748+01	2026-04-22 14:15:12.772+01
ECME297	Banc de test carte ILS	56210000720		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.749+01	2026-04-22 14:15:12.773+01
ECME298	Cale d'entre grain			Embases/Relais	t	2025-03-12	VERIFICATION	2026-03-11	2026-02-09		IP	2026-02-27 04:36:31.75+01	2026-04-22 14:15:12.774+01
ECME299	Cale d'entre grain			Embases/Relais	t	2025-03-12	VERIFICATION	2026-03-11	2026-02-09		IP	2026-02-27 04:36:31.751+01	2026-04-22 14:15:12.775+01
ECME300	Cale d'entre grain			Embases/Relais	t	2025-03-12	VERIFICATION	2026-03-11	2026-02-09		IP	2026-02-27 04:36:31.752+01	2026-04-22 14:15:12.775+01
ECME301	Banc de test luneau			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.752+01	2026-04-22 14:15:12.776+01
ECME302	Banc de test ayadypool	ND3923 / ND3924		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.753+01	2026-04-22 14:15:12.777+01
ECME303	Banc de test carte booster			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.754+01	2026-04-22 14:15:12.778+01
ECME304	Banc de test UNIF CF en boitier REVG			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.755+01	2026-04-22 14:15:12.779+01
ECME305	Banc de test carte commande D A	56170006102		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.755+01	2026-04-22 14:15:12.78+01
ECME306	Banc de test carte palpeuse  CEMAP			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.756+01	2026-04-22 14:15:12.78+01
ECME307	Appareil de mesure de l'inductance	TENMA 72-10465	MET-NE37	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.757+01	2026-04-22 14:15:12.781+01
ECME308	Banc de test renesas			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.758+01	2026-04-22 14:15:12.782+01
ECME309	Alimentation	NICE-POWER	R-SPS20010-232	Electro-aimants	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.758+01	2026-04-22 14:15:12.785+01
ECME310	Multim�tre	FLUKE 175	63430308	KUHN	t	2025-03-18	VERIFICATION	2026-03-17	2026-02-15		IP	2026-02-27 04:36:31.759+01	2026-04-22 14:15:12.787+01
ECME311	Banc de test pour BT82538		APE257	Electronique	t	2024-01-30	VERIFICATION	2025-01-29	2024-12-30	retour au client le 26/04/2024	IP	2026-02-27 04:36:31.76+01	2026-04-22 14:15:12.789+01
ECME312	Megometre	C.A6526	P3427	Chauvin Arnoux	t	2025-03-28	VERIFICATION	2026-03-28	2026-02-26		IP	2026-02-27 04:36:31.761+01	2026-04-22 14:15:12.79+01
ECME313	Banc de test PSXXXX	ND4249		Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.762+01	2026-04-22 14:15:12.791+01
ECME314	Banc de test cart 005144	POOL	0045#36	Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.763+01	2026-04-22 14:15:12.791+01
ECME315	Banc de test cart FAAC0033			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.764+01	2026-04-22 14:15:12.792+01
ECME316	Banc de test KAS			Electronique	f	\N	EXEMPTE	\N	\N	Exempt� de v�rification	Exempté	2026-02-27 04:36:31.765+01	2026-04-22 14:15:12.793+01
\.


--
-- TOC entry 5689 (class 0 OID 24681)
-- Dependencies: 240
-- Data for Name: ecme_interventions; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.ecme_interventions (id, ecme_code, date, nature, resultat, visa, "createdAt", "updatedAt") FROM stdin;
4415	ECME312	2025-03-27	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4416	ECME310	2025-03-17	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4417	ECME300	2023-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4418	ECME300	2024-03-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4419	ECME300	2025-03-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4420	ECME299	2023-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4421	ECME299	2024-03-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4422	ECME299	2025-03-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4423	ECME298	2023-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4424	ECME298	2024-03-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4425	ECME298	2025-03-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4426	ECME295	2023-04-19	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4427	ECME295	2024-05-03	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4428	ECME295	2025-05-22	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4429	ECME294	2022-01-12	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4430	ECME294	2023-04-17	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4431	ECME293	2022-01-12	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4432	ECME293	2023-04-17	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4433	ECME292	2022-10-21	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4434	ECME292	2023-10-22	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4435	ECME292	2024-11-05	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4436	ECME289	2022-10-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4437	ECME289	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4438	ECME289	2024-11-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4439	ECME284	2022-01-24	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4440	ECME284	2023-05-02	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4441	ECME284	2024-12-11	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4442	ECME283	2022-01-24	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4443	ECME283	2023-05-02	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4444	ECME283	2024-12-11	vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4445	ECME281	2018-06-14	Vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4446	ECME281	2020-06-04	Vérification	conforme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4447	ECME281	2021-10-15	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4448	ECME281	2022-04-21	Vérification	déclasser définitive	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4449	ECME281	2022-10-20	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4450	ECME281	2023-10-23	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4451	ECME281	2024-11-01	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4452	ECME275	2020-12-16	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4453	ECME275	2021-12-26	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4454	ECME275	2023-12-19	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4455	ECME275	2025-01-05	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4456	ECME273	2019-11-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4457	ECME273	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4458	ECME273	2022-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4459	ECME273	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4460	ECME273	2024-09-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4461	ECME273	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4462	ECME266	2019-11-29	Vérification	Conforme	Metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4463	ECME266	2020-12-09	Vérification	Conforme	metracal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4464	ECME266	2022-01-31	Vérification	Conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4465	ECME266	2023-01-23	Vérification	Conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4466	ECME266	2024-01-29	Vérification	Conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4467	ECME266	2025-03-16	Vérification	Conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4468	ECME265	2019-06-14	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4469	ECME265	2020-06-03	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4470	ECME265	2021-10-14	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4471	ECME265	2022-10-19	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4472	ECME265	2023-10-22	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4473	ECME265	2024-11-01	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4474	ECME263	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4475	ECME263	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4476	ECME263	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4477	ECME263	2022-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4478	ECME263	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4479	ECME263	2024-09-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4480	ECME263	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4481	ECME262	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4482	ECME262	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4483	ECME262	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4484	ECME262	2022-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4485	ECME262	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4486	ECME262	2024-09-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4487	ECME262	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4488	ECME261	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4489	ECME261	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4490	ECME261	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4491	ECME261	2022-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4492	ECME261	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4493	ECME261	2024-09-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4494	ECME261	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4495	ECME260	2018-02-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4496	ECME260	2019-02-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4497	ECME260	2020-02-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4498	ECME260	2021-02-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4499	ECME260	2022-02-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4500	ECME260	2023-01-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4501	ECME260	2024-03-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4502	ECME260	2025-03-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4503	ECME259	2018-02-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4504	ECME259	2019-02-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4505	ECME259	2020-02-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4506	ECME259	2021-02-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4507	ECME259	2022-02-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4508	ECME259	2023-01-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4509	ECME259	2024-03-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4510	ECME259	2025-03-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4511	ECME257	2017-11-28	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4512	ECME257	2018-11-27	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4513	ECME257	2019-11-26	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4514	ECME257	2020-11-25	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4515	ECME257	2021-11-24	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4516	ECME257	2022-11-23	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4517	ECME257	2023-11-22	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4518	ECME257	2024-11-22	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4519	ECME256	2017-04-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4520	ECME256	2018-05-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4521	ECME255	2017-03-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4522	ECME255	2018-03-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4523	ECME255	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4524	ECME255	2020-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4525	ECME255	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4526	ECME255	2022-10-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4527	ECME255	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4528	ECME255	2024-11-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4529	ECME254	2017-03-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4530	ECME254	2018-03-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4531	ECME254	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4532	ECME254	2020-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4533	ECME254	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4534	ECME254	2022-10-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4535	ECME254	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4536	ECME254	2024-11-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4537	ECME253	2018-02-06	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4538	ECME253	2019-03-27	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4539	ECME253	2020-05-12	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4540	ECME253	2021-06-11	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4541	ECME253	2022-06-29	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4542	ECME253	2023-09-01	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4543	ECME253	2024-09-10	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4544	ECME253	2025-10-03	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4545	ECME252	2018-02-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4546	ECME252	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4547	ECME252	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4548	ECME252	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4549	ECME252	2022-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4550	ECME252	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4551	ECME252	2024-09-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4552	ECME252	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4553	ECME251	2018-01-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4554	ECME251	2019-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4555	ECME251	2020-01-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4556	ECME251	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4557	ECME251	2022-04-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4558	ECME251	2023-03-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4559	ECME251	2024-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4560	ECME251	2025-07-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4561	ECME250	2017-01-09	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4562	ECME250	2017-11-07	calibrage +vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4563	ECME250	2018-11-05	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4564	ECME250	2019-11-29	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4565	ECME250	2020-12-09	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4566	ECME250	2022-01-31	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4567	ECME250	2023-01-23	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4568	ECME250	2024-01-29	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4569	ECME250	2025-03-16	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4570	ECME249	2016-06-05	vérification	contorme	TEC	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4571	ECME249	2017-12-04	vérification	contorme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4572	ECME249	2018-12-09	vérification	contorme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4573	ECME249	2020-01-10	vérification	contorme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4574	ECME249	2021-03-04	vérification	contorme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4575	ECME249	2022-04-25	vérification	contorme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4576	ECME249	2023-09-01	vérification	contorme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4577	ECME249	2024-09-10	vérification	contorme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4578	ECME249	2025-10-03	vérification	contorme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4579	ECME247	2016-02-25	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4580	ECME247	2017-03-13	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4581	ECME247	2018-03-26	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4582	ECME247	2019-03-27	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4583	ECME247	2020-05-12	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4584	ECME247	2021-06-11	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4585	ECME247	2022-06-29	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4586	ECME247	2023-09-01	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4587	ECME247	2024-09-11	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4588	ECME247	2025-10-03	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4589	ECME246	2016-03-09	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4590	ECME246	2017-03-13	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4591	ECME246	2018-03-26	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4592	ECME246	2019-03-27	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4593	ECME246	2020-05-12	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4594	ECME246	2021-06-11	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4595	ECME246	2022-06-28	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4596	ECME246	2023-09-01	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4597	ECME246	2024-09-13	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4598	ECME246	2025-10-03	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4599	ECME243	2017-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4600	ECME243	2018-02-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4601	ECME243	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4602	ECME243	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4603	ECME243	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4604	ECME243	2022-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4605	ECME243	2023-09-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4606	ECME243	2024-09-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4607	ECME243	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4608	ECME241	2017-01-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4609	ECME241	2018-02-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4610	ECME241	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4611	ECME241	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4612	ECME241	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4613	ECME241	2022-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4614	ECME241	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4615	ECME241	2024-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4616	ECME241	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4617	ECME240	2017-01-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4618	ECME240	2018-02-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4619	ECME240	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4620	ECME240	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4621	ECME240	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4622	ECME240	2022-06-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4623	ECME240	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4624	ECME240	2024-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4625	ECME240	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4626	ECME238	2017-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4627	ECME238	2018-02-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4628	ECME238	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4629	ECME238	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4630	ECME238	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4631	ECME238	2022-07-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4632	ECME238	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4633	ECME238	2024-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4634	ECME238	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4635	ECME236	2016-03-09	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4636	ECME236	2017-03-13	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4637	ECME236	2018-03-26	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4638	ECME236	2019-03-27	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4639	ECME236	2020-05-12	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4640	ECME236	2021-06-11	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4641	ECME236	2022-06-29	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4642	ECME236	2023-09-01	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4643	ECME236	2024-09-11	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4644	ECME236	2025-10-03	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4645	ECME234	2021-05-27	alimentation ne fonctionne pas	changement un fusible	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4646	ECME233	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4647	ECME233	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4648	ECME233	2018-05-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4649	ECME233	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4650	ECME233	2020-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4651	ECME233	2021-10-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4652	ECME233	2022-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4653	ECME233	2023-10-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4654	ECME233	2024-11-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4655	ECME232	2017-01-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4656	ECME232	2018-01-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4657	ECME232	2019-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4658	ECME232	2020-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4659	ECME232	2021-03-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4660	ECME232	2022-04-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4661	ECME232	2023-03-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4662	ECME232	2024-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4663	ECME232	2025-07-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4664	ECME231	2017-01-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4665	ECME231	2018-01-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4666	ECME231	2019-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4667	ECME231	2020-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4668	ECME231	2021-03-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4669	ECME231	2022-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4670	ECME231	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4671	ECME231	2024-09-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4672	ECME231	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4673	ECME230	2017-01-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4674	ECME230	2018-01-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4675	ECME230	2019-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4676	ECME230	2020-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4677	ECME230	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4678	ECME230	2022-04-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4679	ECME230	2023-03-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4680	ECME230	2024-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4681	ECME230	2025-07-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4682	ECME229	2017-01-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4683	ECME229	2018-01-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4684	ECME229	2019-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4685	ECME229	2020-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4686	ECME229	2021-03-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4687	ECME229	2022-04-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4688	ECME229	2023-03-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4689	ECME229	2024-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4690	ECME229	2025-07-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4691	ECME228	2017-01-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4692	ECME228	2018-01-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4693	ECME228	2019-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4694	ECME228	2020-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4695	ECME228	2021-03-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4696	ECME228	2022-04-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4697	ECME228	2023-04-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4698	ECME228	2024-05-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4699	ECME228	2025-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4700	ECME227	2016-06-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4701	ECME227	2017-06-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4702	ECME227	2018-06-08	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4703	ECME227	2019-06-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4704	ECME227	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4705	ECME227	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4706	ECME227	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4707	ECME227	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4708	ECME227	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4709	ECME227	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4710	ECME226	2017-01-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4711	ECME226	2018-01-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4712	ECME226	2019-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4713	ECME226	2020-01-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4714	ECME226	2021-03-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4715	ECME226	2022-04-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4716	ECME226	2023-04-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4717	ECME226	2024-05-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4718	ECME226	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4719	ECME224	2016-01-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4720	ECME224	2017-01-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4721	ECME224	2018-01-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4722	ECME224	2019-01-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4723	ECME224	2020-01-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4724	ECME224	2021-02-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4725	ECME224	2022-04-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4726	ECME224	2023-09-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4727	ECME224	2024-09-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4728	ECME224	2025-09-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4729	ECME222	2016-01-27	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4730	ECME222	2017-01-27	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4731	ECME222	2018-02-06	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4732	ECME222	2019-03-27	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4733	ECME222	2020-05-12	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4734	ECME222	2021-06-11	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4735	ECME222	2022-06-29	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4736	ECME222	2023-09-01	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4737	ECME222	2024-09-10	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4738	ECME222	2025-10-03	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4739	ECME220	2014-09-02	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4740	ECME220	2016-11-02	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4741	ECME220	2017-07-13	retour au client définitivement		Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4742	ECME216	2015-05-19	tournevis caser	changement un nouveau tournevis le 17/06/2015	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4743	ECME216	2016-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4744	ECME216	2017-12-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4745	ECME216	2018-12-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4746	ECME216	2020-01-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4747	ECME216	2021-03-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4748	ECME216	2022-04-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4749	ECME216	2023-04-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4750	ECME216	2024-05-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4751	ECME216	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4752	ECME212	2014-02-19	changement  pinne de test de banc LY095 et LY090	bon	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4753	ECME212	2014-12-11	changement du deux ventilateur d'aération	bon	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4754	ECME209	2013-05-28	La tension ne peut plus dépasser 30v	retour au client définitivement le29/05/2013	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4755	ECME201	2012-08-26	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4756	ECME201	2013-08-25	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4757	ECME200	2012-08-26	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4758	ECME200	2013-08-25	vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4759	ECME199	2012-09-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4760	ECME199	2013-09-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4761	ECME199	2015-01-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4762	ECME199	2016-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4763	ECME199	2017-01-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4764	ECME199	2018-02-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4765	ECME199	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4766	ECME199	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4767	ECME199	2021-06-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4768	ECME199	2022-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4769	ECME199	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4770	ECME199	2024-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4771	ECME199	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4772	ECME198	2012-07-02	vérification	conforme	sarhan	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4773	ECME198	2013-09-28	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4774	ECME198	2015-01-16	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4775	ECME198	2016-01-27	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4776	ECME198	2017-01-27	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4777	ECME198	2018-02-06	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4778	ECME198	2019-03-27	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4779	ECME198	2020-05-12	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4780	ECME198	2021-06-11	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4781	ECME198	2022-06-29	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4782	ECME198	2023-09-01	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4783	ECME198	2024-09-10	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4784	ECME198	2025-10-03	vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4785	ECME197	2018-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4786	ECME197	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4787	ECME197	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4788	ECME197	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4789	ECME197	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4790	ECME197	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4791	ECME197	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4792	ECME197	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4793	ECME196	2015-03-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4794	ECME196	2016-03-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4795	ECME196	2017-03-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4796	ECME196	2018-03-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4797	ECME196	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4798	ECME196	2020-03-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4799	ECME196	2021-03-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4800	ECME196	2022-03-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4801	ECME196	2023-03-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4802	ECME196	2024-03-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4803	ECME196	2025-03-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4804	ECME195	2015-03-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4805	ECME195	2016-03-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4806	ECME195	2017-03-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4807	ECME195	2018-03-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4808	ECME195	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4809	ECME195	2020-03-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4810	ECME195	2021-03-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4811	ECME195	2022-03-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4812	ECME195	2023-03-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4813	ECME195	2024-03-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4814	ECME195	2025-03-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4815	ECME194	2012-06-11	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4816	ECME194	2013-06-19	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4817	ECME194	2014-06-13	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4818	ECME194	2015-06-16	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4819	ECME194	2016-03-01	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4820	ECME194	2017-03-13	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4821	ECME194	2018-03-21	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4822	ECME194	2019-03-27	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4823	ECME194	2020-05-12	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4824	ECME194	2021-06-11	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4825	ECME194	2022-06-27	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4826	ECME194	2023-09-01	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4827	ECME194	2024-09-11	Vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4828	ECME190	2011-07-12	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4829	ECME190	2012-07-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4830	ECME190	2013-07-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4831	ECME190	2014-07-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4832	ECME190	2015-07-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4833	ECME190	2016-07-08	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4834	ECME190	2017-07-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4835	ECME190	2018-07-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4836	ECME190	2019-07-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4837	ECME190	2020-07-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4838	ECME190	2021-07-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4839	ECME190	2022-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4840	ECME190	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4841	ECME190	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4842	ECME190	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4843	ECME189	2011-06-26	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4844	ECME189	2012-09-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4845	ECME189	2013-09-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4846	ECME189	2015-01-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4847	ECME189	2016-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4848	ECME189	2017-12-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4849	ECME189	2018-12-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4850	ECME189	2020-01-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4851	ECME189	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4852	ECME189	2022-04-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4853	ECME189	2023-04-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4854	ECME189	2024-05-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4855	ECME189	2025-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4856	ECME188	2011-04-17	Vérification	conforme d'aprét le client ( rapport non recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4857	ECME188	2013-05-26	Vérification	conforme d'aprét le client ( rapport non recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4858	ECME186	2012-03-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4859	ECME186	2013-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4860	ECME186	2014-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4861	ECME186	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4862	ECME186	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4863	ECME186	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4864	ECME186	2018-05-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4865	ECME186	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4866	ECME186	2020-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4867	ECME186	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4868	ECME186	2022-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4869	ECME186	2023-10-18	déclasser  définitive		imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4870	ECME181	2011-01-25	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4871	ECME181	2012-03-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4872	ECME181	2013-04-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4873	ECME181	2014-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4874	ECME181	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4875	ECME181	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4876	ECME181	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4877	ECME181	2018-05-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4878	ECME181	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4879	ECME181	2020-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4880	ECME181	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4881	ECME181	2022-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4882	ECME181	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4883	ECME181	2024-11-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4884	ECME180	2011-01-10	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4885	ECME180	2012-03-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4886	ECME180	2013-04-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4887	ECME180	2014-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4888	ECME180	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4889	ECME180	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4890	ECME180	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4891	ECME180	2018-05-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4892	ECME180	2019-06-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4893	ECME180	2021-03-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4894	ECME180	2022-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4895	ECME180	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4896	ECME180	2024-09-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4897	ECME180	2025-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4898	ECME179	2010-09-16	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4899	ECME179	2011-10-08	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4900	ECME179	2012-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4901	ECME179	2013-12-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4902	ECME179	2015-01-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4903	ECME179	2016-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4904	ECME179	2017-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4905	ECME179	2018-02-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4906	ECME179	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4907	ECME179	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4908	ECME179	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4909	ECME179	2022-06-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4910	ECME179	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4911	ECME179	2024-09-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4912	ECME179	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4913	ECME178	2010-12-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4914	ECME178	2011-12-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4915	ECME178	2013-01-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4916	ECME178	2014-03-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4917	ECME178	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4918	ECME178	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4919	ECME178	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4920	ECME178	2018-05-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4921	ECME178	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4922	ECME178	2020-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4923	ECME178	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4924	ECME178	2022-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4925	ECME178	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4926	ECME178	2024-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4927	ECME177	2010-12-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4928	ECME177	2011-12-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4929	ECME177	2013-01-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4930	ECME177	2014-03-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4931	ECME177	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4932	ECME177	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4933	ECME177	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4934	ECME177	2018-05-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4935	ECME177	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4936	ECME177	2020-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4937	ECME177	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4938	ECME177	2022-04-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4939	ECME177	2022-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4940	ECME177	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4941	ECME177	2024-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4942	ECME176	2010-12-08	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4943	ECME176	2011-12-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4944	ECME176	2012-12-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4945	ECME176	2013-05-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4946	ECME176	2018-11-21	vérification	non-conforme déclasser le 29/11/2018	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4947	ECME175	2010-11-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4948	ECME175	2011-11-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4949	ECME175	2012-12-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4950	ECME175	2013-12-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4951	ECME175	2014-12-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4952	ECME175	2015-12-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4953	ECME175	2016-12-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4954	ECME175	2017-12-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4955	ECME175	2018-11-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4956	ECME175	2019-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4957	ECME175	2020-11-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4958	ECME175	2021-11-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4959	ECME175	2022-11-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4960	ECME175	2023-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4961	ECME175	2024-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4962	ECME174	2017-11-16	câble d'alimentation couper	réparation du câble	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4963	ECME172	2014-04-03	changement deux résistance 100 Ω	bon	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4964	ECME171	2011-10-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4965	ECME171	2012-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4966	ECME171	2013-12-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4967	ECME171	2015-01-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4968	ECME171	2016-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4969	ECME171	2017-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4970	ECME171	2018-02-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4971	ECME171	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4972	ECME171	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4973	ECME171	2021-05-11	déclasser définitive		imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4974	ECME169	2018-05-14	Vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4975	ECME169	2019-07-07	Vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4976	ECME169	2020-07-06	Vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4977	ECME169	2021-07-05	Vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4978	ECME169	2022-07-04	Vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4979	ECME169	2023-07-03	Vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4980	ECME169	2024-07-02	Vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4981	ECME169	2025-07-01	Vérefication	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4982	ECME168	2011-10-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4983	ECME168	2012-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4984	ECME168	2013-12-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4985	ECME168	2015-01-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4986	ECME168	2016-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4987	ECME168	2017-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4988	ECME168	2018-02-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4989	ECME168	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4990	ECME168	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4991	ECME168	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4992	ECME168	2022-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4993	ECME168	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4994	ECME168	2024-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4995	ECME168	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4996	ECME167	2011-10-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4997	ECME167	2012-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4998	ECME167	2013-12-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
4999	ECME167	2015-01-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5000	ECME167	2016-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5001	ECME167	2017-01-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5002	ECME167	2018-02-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5003	ECME167	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5004	ECME167	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5005	ECME167	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5006	ECME167	2022-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5007	ECME167	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5008	ECME167	2024-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5009	ECME167	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5010	ECME166	2010-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5011	ECME166	2010-02-15	conception d'une nouvelle cale de 12,5  à cause de 'usure de l'ancienne cale (Épaisseur ==> 12)	OK	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5012	ECME166	2011-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5013	ECME166	2012-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5014	ECME166	2013-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5015	ECME166	2014-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5016	ECME166	2015-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5017	ECME166	2016-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5018	ECME166	2017-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5019	ECME166	2018-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5020	ECME166	2019-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5021	ECME166	2020-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5022	ECME166	2021-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5023	ECME166	2022-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5024	ECME166	2023-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5025	ECME166	2024-01-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5026	ECME166	2025-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5027	ECME165	2010-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5028	ECME165	2011-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5029	ECME165	2012-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5030	ECME165	2013-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5031	ECME165	2014-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5032	ECME165	2015-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5033	ECME165	2016-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5034	ECME165	2017-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5035	ECME165	2018-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5036	ECME165	2019-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5037	ECME165	2020-01-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5038	ECME165	2021-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5039	ECME165	2022-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5040	ECME165	2023-01-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5041	ECME165	2024-01-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5042	ECME165	2025-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5043	ECME164	2010-12-07	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5044	ECME164	2011-12-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5045	ECME164	2012-12-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5046	ECME164	2014-03-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5047	ECME164	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5048	ECME164	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5049	ECME164	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5050	ECME164	2018-05-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5051	ECME164	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5052	ECME164	2020-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5053	ECME164	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5054	ECME164	2022-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5055	ECME164	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5056	ECME164	2024-11-02	vérification	non conforme déclasser le 02/11/2024	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5057	ECME163	2010-12-07	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5058	ECME163	2011-12-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5059	ECME163	2012-12-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5060	ECME163	2014-03-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5061	ECME163	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5062	ECME163	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5063	ECME163	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5064	ECME163	2018-05-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5065	ECME163	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5066	ECME163	2020-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5067	ECME163	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5068	ECME163	2022-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5069	ECME163	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5070	ECME163	2024-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5071	ECME162	2010-10-23	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5072	ECME162	2011-12-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5073	ECME162	2012-12-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5074	ECME162	2013-12-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5075	ECME162	2014-12-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5076	ECME162	2015-12-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5077	ECME162	2016-12-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5078	ECME162	2017-12-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5079	ECME162	2018-11-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5080	ECME162	2019-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5081	ECME162	2020-11-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5082	ECME162	2021-11-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5083	ECME162	2022-11-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5084	ECME162	2023-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5085	ECME162	2024-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5086	ECME161	2010-11-23	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5087	ECME161	2011-12-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5088	ECME161	2012-12-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5089	ECME161	2013-12-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5090	ECME161	2014-12-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5091	ECME161	2015-12-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5092	ECME161	2016-12-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5093	ECME161	2017-12-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5094	ECME161	2018-11-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5095	ECME161	2019-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5096	ECME161	2020-11-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5097	ECME161	2021-11-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5098	ECME161	2022-11-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5099	ECME161	2023-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5100	ECME161	2024-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5101	ECME160	2010-10-12	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5102	ECME160	2011-12-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5103	ECME160	2012-12-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5104	ECME160	2013-12-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5105	ECME160	2014-12-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5106	ECME160	2015-12-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5107	ECME160	2016-12-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5108	ECME160	2017-12-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5109	ECME160	2018-11-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5110	ECME160	2019-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5111	ECME160	2020-11-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5112	ECME160	2021-11-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5113	ECME160	2022-11-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5114	ECME160	2023-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5115	ECME160	2024-11-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5116	ECME159	2010-12-05	étalonnage	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5117	ECME159	2011-12-16	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5118	ECME159	2012-12-26	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5119	ECME159	2013-12-19	fil aman HS	demande une pièce de rechange	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5120	ECME159	2014-04-09	changement un fil aman	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5121	ECME159	2014-04-15	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5122	ECME159	2015-04-14	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5123	ECME159	2016-04-25	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5124	ECME159	2017-05-05	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5125	ECME159	2018-05-11	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5126	ECME159	2019-06-14	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5127	ECME159	2020-06-05	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5128	ECME159	2021-10-14	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5129	ECME159	2022-10-19	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5130	ECME159	2023-10-02	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5131	ECME159	2024-09-30	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5132	ECME159	2025-10-03	Vérification	conforme	Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5133	ECME158	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5134	ECME158	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5135	ECME158	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5136	ECME158	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5137	ECME158	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5138	ECME158	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5139	ECME158	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5140	ECME158	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5141	ECME158	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5142	ECME158	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5143	ECME158	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5144	ECME158	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5145	ECME158	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5146	ECME158	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5147	ECME158	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5148	ECME158	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5149	ECME158	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5150	ECME157	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5151	ECME157	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5152	ECME157	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5153	ECME157	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5154	ECME157	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5155	ECME157	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5156	ECME157	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5157	ECME157	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5158	ECME157	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5159	ECME157	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5160	ECME157	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5161	ECME157	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5162	ECME157	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5163	ECME157	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5164	ECME157	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5165	ECME157	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5166	ECME157	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5167	ECME156	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5168	ECME156	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5169	ECME156	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5170	ECME156	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5171	ECME156	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5172	ECME156	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5173	ECME156	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5174	ECME156	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5175	ECME156	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5176	ECME156	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5177	ECME156	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5178	ECME156	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5179	ECME156	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5180	ECME156	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5181	ECME156	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5182	ECME156	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5183	ECME156	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5184	ECME155	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5185	ECME155	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5186	ECME155	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5187	ECME155	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5188	ECME155	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5189	ECME155	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5190	ECME155	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5191	ECME155	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5192	ECME155	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5193	ECME155	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5194	ECME155	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5195	ECME155	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5196	ECME155	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5197	ECME155	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5198	ECME155	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5199	ECME155	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5200	ECME155	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5201	ECME154	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5202	ECME154	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5203	ECME154	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5204	ECME154	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5205	ECME154	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5206	ECME154	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5207	ECME154	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5208	ECME154	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5209	ECME154	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5210	ECME154	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5211	ECME154	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5212	ECME154	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5213	ECME154	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5214	ECME154	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5215	ECME154	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5216	ECME154	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5217	ECME154	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5218	ECME153	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5219	ECME153	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5220	ECME153	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5221	ECME153	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5222	ECME153	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5223	ECME153	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5224	ECME153	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5225	ECME153	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5226	ECME153	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5227	ECME153	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5228	ECME153	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5229	ECME153	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5230	ECME153	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5231	ECME153	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5232	ECME153	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5233	ECME153	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5234	ECME153	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5235	ECME152	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5236	ECME152	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5237	ECME152	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5238	ECME152	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5239	ECME152	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5240	ECME152	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5241	ECME152	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5242	ECME152	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5243	ECME152	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5244	ECME152	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5245	ECME152	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5246	ECME152	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5247	ECME152	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5248	ECME152	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5249	ECME152	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5250	ECME152	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5251	ECME152	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5252	ECME151	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5253	ECME151	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5254	ECME151	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5255	ECME151	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5256	ECME151	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5257	ECME151	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5258	ECME151	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5259	ECME151	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5260	ECME151	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5261	ECME151	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5262	ECME151	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5263	ECME151	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5264	ECME151	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5265	ECME151	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5266	ECME151	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5267	ECME151	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5268	ECME151	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5269	ECME150	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5270	ECME150	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5271	ECME150	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5272	ECME150	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5273	ECME150	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5274	ECME150	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5275	ECME150	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5276	ECME150	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5277	ECME150	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5278	ECME150	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5279	ECME150	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5280	ECME150	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5281	ECME150	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5282	ECME150	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5283	ECME150	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5284	ECME150	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5285	ECME150	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5286	ECME149	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5287	ECME149	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5288	ECME149	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5289	ECME149	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5290	ECME149	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5291	ECME149	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5292	ECME149	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5293	ECME149	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5294	ECME149	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5295	ECME149	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5296	ECME149	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5297	ECME149	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5298	ECME149	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5299	ECME149	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5300	ECME149	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5301	ECME149	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5302	ECME149	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5303	ECME148	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5304	ECME148	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5305	ECME148	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5306	ECME148	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5307	ECME148	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5308	ECME148	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5309	ECME148	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5310	ECME148	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5311	ECME148	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5312	ECME148	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5313	ECME148	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5314	ECME148	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5315	ECME148	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5316	ECME148	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5317	ECME148	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5318	ECME148	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5319	ECME148	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5320	ECME147	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5321	ECME147	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5322	ECME147	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5323	ECME147	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5324	ECME147	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5325	ECME147	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5326	ECME147	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5327	ECME147	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5328	ECME147	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5329	ECME147	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5330	ECME147	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5331	ECME147	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5332	ECME147	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5333	ECME147	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5334	ECME147	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5335	ECME147	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5336	ECME147	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5337	ECME146	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5338	ECME146	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5339	ECME146	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5340	ECME146	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5341	ECME146	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5342	ECME146	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5343	ECME146	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5344	ECME146	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5345	ECME146	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5346	ECME146	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5347	ECME146	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5348	ECME146	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5349	ECME146	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5350	ECME146	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5351	ECME146	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5352	ECME146	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5353	ECME146	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5354	ECME145	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5355	ECME145	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5356	ECME145	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5357	ECME145	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5358	ECME145	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5359	ECME145	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5360	ECME145	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5361	ECME145	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5362	ECME145	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5363	ECME145	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5364	ECME145	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5365	ECME145	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5366	ECME145	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5367	ECME145	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5368	ECME145	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5369	ECME145	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5370	ECME145	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5371	ECME144	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5372	ECME144	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5373	ECME144	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5374	ECME144	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5375	ECME144	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5376	ECME144	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5377	ECME144	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5378	ECME144	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5379	ECME144	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5380	ECME144	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5381	ECME144	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5382	ECME144	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5383	ECME144	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5384	ECME144	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5385	ECME144	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5386	ECME144	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5387	ECME144	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5388	ECME143	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5389	ECME143	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5390	ECME143	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5391	ECME143	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5392	ECME143	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5393	ECME143	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5394	ECME143	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5395	ECME143	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5396	ECME143	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5397	ECME143	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5398	ECME143	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5399	ECME143	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5400	ECME143	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5401	ECME143	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5402	ECME143	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5403	ECME143	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5404	ECME143	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5405	ECME142	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5406	ECME142	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5407	ECME142	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5408	ECME142	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5409	ECME142	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5410	ECME142	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5411	ECME142	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5412	ECME142	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5413	ECME142	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5414	ECME142	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5415	ECME142	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5416	ECME142	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5417	ECME142	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5418	ECME142	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5419	ECME142	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5420	ECME142	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5421	ECME142	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5422	ECME141	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5423	ECME141	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5424	ECME141	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5425	ECME141	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5426	ECME141	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5427	ECME141	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5428	ECME141	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5429	ECME141	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5430	ECME141	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5431	ECME141	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5432	ECME141	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5433	ECME141	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5434	ECME141	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5435	ECME141	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5436	ECME141	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5437	ECME141	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5438	ECME141	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5439	ECME140	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5440	ECME140	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5441	ECME140	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5442	ECME140	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5443	ECME140	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5444	ECME140	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5445	ECME140	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5446	ECME140	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5447	ECME140	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5448	ECME140	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5449	ECME140	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5450	ECME140	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5451	ECME140	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5452	ECME140	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5453	ECME140	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5454	ECME140	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5455	ECME140	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5456	ECME139	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5457	ECME139	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5458	ECME139	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5459	ECME139	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5460	ECME139	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5461	ECME139	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5462	ECME139	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5463	ECME139	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5464	ECME139	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5465	ECME139	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5466	ECME139	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5467	ECME139	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5468	ECME139	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5469	ECME139	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5470	ECME139	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5471	ECME139	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5472	ECME139	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5473	ECME138	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5474	ECME138	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5475	ECME138	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5476	ECME138	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5477	ECME138	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5478	ECME138	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5479	ECME138	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5480	ECME138	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5481	ECME138	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5482	ECME138	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5483	ECME138	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5484	ECME138	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5485	ECME138	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5486	ECME138	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5487	ECME138	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5488	ECME138	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5489	ECME138	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5490	ECME137	2009-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5491	ECME137	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5492	ECME137	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5493	ECME137	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5494	ECME137	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5495	ECME137	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5496	ECME137	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5497	ECME137	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5498	ECME137	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5499	ECME137	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5500	ECME137	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5501	ECME137	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5502	ECME137	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5503	ECME137	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5504	ECME137	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5505	ECME137	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5506	ECME137	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5507	ECME136	2009-10-04	étalonnage	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5508	ECME136	2010-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5509	ECME136	2011-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5510	ECME136	2012-10-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5511	ECME136	2013-10-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5512	ECME136	2014-10-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5513	ECME136	2015-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5514	ECME136	2016-10-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5515	ECME136	2017-10-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5516	ECME136	2018-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5517	ECME136	2019-10-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5518	ECME136	2020-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5519	ECME136	2021-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5520	ECME136	2022-10-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5521	ECME136	2023-10-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5522	ECME136	2024-10-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5523	ECME136	2025-10-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5524	ECME134	2010-06-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5525	ECME134	2011-06-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5526	ECME134	2012-06-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5527	ECME134	2013-06-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5528	ECME134	2014-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5529	ECME134	2015-06-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5530	ECME134	2016-06-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5531	ECME134	2017-06-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5532	ECME133	2010-06-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5533	ECME133	2011-06-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5534	ECME133	2012-06-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5535	ECME133	2013-06-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5536	ECME133	2014-06-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5537	ECME133	2015-06-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5538	ECME133	2016-06-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5539	ECME133	2017-06-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5540	ECME126	2007-10-21	le voyant S s'allume tout le temps ( defaut S1)	réparation du capteur	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5541	ECME126	2009-01-27	cosse de la platine R1246 et cassée	changement du platine R1246 SSDT	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5542	ECME126	2010-03-17	résultat de test : presence de defaut	changement du platine R1246 SSDT et deux touches contact	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5543	ECME125	2009-01-25	Fonction intermittent	changement du connecteur male 37 poins et les touches contacte avec le socle 95002320	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5544	ECME125	2009-07-15	machine ne fonctionnelle	réparation du distributeur	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5545	ECME124	2009-02-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5546	ECME124	2010-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5547	ECME124	2011-02-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5548	ECME124	2012-03-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5549	ECME124	2013-04-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5550	ECME124	2014-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5551	ECME124	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5552	ECME124	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5553	ECME124	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5554	ECME124	2018-05-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5555	ECME124	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5556	ECME124	2020-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5557	ECME124	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5558	ECME124	2022-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5559	ECME124	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5560	ECME124	2024-11-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5561	ECME123	2009-02-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5562	ECME123	2010-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5563	ECME123	2011-07-10	changement un nouvelle testeur A,402			2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5564	ECME123	2011-07-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5565	ECME123	2012-09-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5566	ECME123	2013-10-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5567	ECME123	2014-11-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5568	ECME123	2015-12-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5569	ECME123	2017-01-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5570	ECME123	2018-01-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5571	ECME123	2018-12-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5572	ECME123	2019-12-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5573	ECME123	2020-12-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5574	ECME123	2021-12-26	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5575	ECME123	2023-12-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5576	ECME123	2025-01-08	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5577	ECME122	2007-01-04	vérification	conforme d'aprét le client ( rapport non recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5578	ECME122	2009-01-27	vérification	conforme d'aprét le client ( rapport non recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5579	ECME122	2011-03-13	vérification	conforme d'aprét le client ( rapport non recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5580	ECME122	2013-05-26	vérification	conforme d'aprét le client ( rapport non recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5581	ECME121	2008-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5582	ECME121	2009-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5583	ECME121	2010-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5584	ECME121	2011-05-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5585	ECME121	2012-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5586	ECME121	2013-05-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5587	ECME121	2014-06-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5588	ECME121	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5589	ECME121	2016-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5590	ECME121	2017-12-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5591	ECME121	2018-12-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5592	ECME121	2020-01-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5593	ECME121	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5594	ECME121	2022-04-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5595	ECME121	2023-04-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5596	ECME121	2024-05-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5597	ECME121	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5598	ECME120	2008-04-14	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5599	ECME120	2009-05-08	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5600	ECME120	2010-05-06	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5601	ECME120	2011-05-09	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5602	ECME120	2012-05-09	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5603	ECME120	2013-05-27	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5604	ECME120	2014-06-01	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5605	ECME120	2015-06-14	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5606	ECME120	2017-01-08	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5607	ECME120	2017-11-07	calibrage + vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5608	ECME120	2018-11-05	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5609	ECME120	2019-11-29	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5610	ECME120	2020-12-09	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5611	ECME120	2022-01-31	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5612	ECME120	2023-01-23	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5613	ECME120	2024-01-29	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5614	ECME120	2025-03-16	vérification	conforme	metrocal	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5615	ECME119	2008-04-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5616	ECME119	2009-04-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5617	ECME119	2010-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5618	ECME119	2011-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5619	ECME119	2012-04-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5620	ECME119	2013-04-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5621	ECME119	2014-04-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5622	ECME119	2015-04-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5623	ECME119	2016-04-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5624	ECME119	2017-04-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5625	ECME119	2018-04-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5626	ECME119	2019-04-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5627	ECME119	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5628	ECME119	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5629	ECME119	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5630	ECME119	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5631	ECME119	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5632	ECME119	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5633	ECME118	2009-02-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5634	ECME118	2010-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5635	ECME118	2011-02-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5636	ECME118	2012-03-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5637	ECME118	2013-04-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5638	ECME118	2014-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5639	ECME118	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5640	ECME118	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5641	ECME118	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5642	ECME118	2018-05-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5643	ECME118	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5644	ECME118	2020-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5645	ECME118	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5646	ECME118	2022-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5647	ECME118	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5648	ECME118	2024-11-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5649	ECME117	2009-02-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5650	ECME117	2010-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5651	ECME117	2011-02-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5652	ECME117	2012-03-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5653	ECME117	2013-04-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5654	ECME117	2014-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5655	ECME117	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5656	ECME117	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5657	ECME117	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5658	ECME117	2018-05-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5659	ECME117	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5660	ECME117	2020-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5661	ECME117	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5662	ECME117	2022-10-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5663	ECME117	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5664	ECME117	2024-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5665	ECME116	2008-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5666	ECME116	2009-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5667	ECME116	2010-05-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5668	ECME116	2011-05-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5669	ECME116	2012-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5670	ECME116	2013-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5671	ECME116	2014-06-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5672	ECME116	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5673	ECME116	2017-01-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5674	ECME116	2018-02-08	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5675	ECME116	2019-03-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5676	ECME116	2020-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5677	ECME116	2021-06-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5678	ECME116	2022-06-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5679	ECME116	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5680	ECME116	2024-09-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5681	ECME116	2025-10-08	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5682	ECME115	2008-04-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5683	ECME115	2009-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5684	ECME115	2010-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5685	ECME115	2011-05-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5686	ECME115	2012-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5687	ECME115	2013-05-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5688	ECME115	2014-06-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5689	ECME115	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5690	ECME115	2016-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5691	ECME115	2017-12-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5692	ECME115	2018-12-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5693	ECME115	2020-01-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5694	ECME115	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5695	ECME115	2022-04-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5696	ECME115	2023-03-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5697	ECME115	2024-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5698	ECME115	2025-07-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5699	ECME114	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5700	ECME114	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5701	ECME114	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5702	ECME114	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5703	ECME114	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5704	ECME114	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5705	ECME114	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5706	ECME114	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5707	ECME114	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5708	ECME114	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5709	ECME114	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5710	ECME114	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5711	ECME114	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5712	ECME114	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5713	ECME114	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5714	ECME114	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5715	ECME114	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5716	ECME114	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5717	ECME114	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5718	ECME113	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5719	ECME113	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5720	ECME113	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5721	ECME113	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5722	ECME113	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5723	ECME113	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5724	ECME113	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5725	ECME113	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5726	ECME113	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5727	ECME113	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5728	ECME113	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5729	ECME113	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5730	ECME113	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5731	ECME113	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5732	ECME113	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5733	ECME113	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5734	ECME113	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5735	ECME113	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5736	ECME113	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5737	ECME112	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5738	ECME112	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5739	ECME112	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5740	ECME112	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5741	ECME112	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5742	ECME112	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5743	ECME112	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5744	ECME112	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5745	ECME112	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5746	ECME112	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5747	ECME112	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5748	ECME112	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5749	ECME112	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5750	ECME112	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5751	ECME112	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5752	ECME112	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5753	ECME112	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5754	ECME112	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5755	ECME112	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5756	ECME111	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5757	ECME111	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5758	ECME111	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5759	ECME111	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5760	ECME111	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5761	ECME111	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5762	ECME111	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5763	ECME111	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5764	ECME111	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5765	ECME111	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5766	ECME111	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5767	ECME111	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5768	ECME111	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5769	ECME111	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5770	ECME111	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5771	ECME111	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5772	ECME111	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5773	ECME111	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5774	ECME111	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5775	ECME110	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5776	ECME110	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5777	ECME110	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5778	ECME110	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5779	ECME110	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5780	ECME110	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5781	ECME110	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5782	ECME110	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5783	ECME110	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5784	ECME110	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5785	ECME110	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5786	ECME110	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5787	ECME110	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5788	ECME110	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5789	ECME110	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5790	ECME110	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5791	ECME110	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5792	ECME110	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5793	ECME110	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5794	ECME109	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5795	ECME109	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5796	ECME109	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5797	ECME109	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5798	ECME109	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5799	ECME109	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5800	ECME109	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5801	ECME109	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5802	ECME109	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5803	ECME109	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5804	ECME109	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5805	ECME109	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5806	ECME109	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5807	ECME109	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5808	ECME109	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5809	ECME109	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5810	ECME109	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5811	ECME109	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5812	ECME109	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5813	ECME108	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5814	ECME108	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5815	ECME108	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5816	ECME108	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5817	ECME108	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5818	ECME108	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5819	ECME108	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5820	ECME108	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5821	ECME108	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5822	ECME108	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5823	ECME108	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5824	ECME108	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5825	ECME108	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5826	ECME108	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5827	ECME108	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5828	ECME108	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5829	ECME108	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5830	ECME108	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5831	ECME108	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5832	ECME107	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5833	ECME107	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5834	ECME107	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5835	ECME107	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5836	ECME107	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5837	ECME107	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5838	ECME107	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5839	ECME107	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5840	ECME107	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5841	ECME107	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5842	ECME107	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5843	ECME107	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5844	ECME107	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5845	ECME107	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5846	ECME107	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5847	ECME107	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5848	ECME107	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5849	ECME107	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5850	ECME107	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5851	ECME106	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5852	ECME106	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5853	ECME106	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5854	ECME106	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5855	ECME106	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5856	ECME106	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5857	ECME106	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5858	ECME106	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5859	ECME106	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5860	ECME106	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5861	ECME106	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5862	ECME106	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5863	ECME106	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5864	ECME106	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5865	ECME106	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5866	ECME106	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5867	ECME106	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5868	ECME106	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5869	ECME106	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5870	ECME105	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5871	ECME105	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5872	ECME105	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5873	ECME105	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5874	ECME105	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5875	ECME105	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5876	ECME105	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5877	ECME105	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5878	ECME105	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5879	ECME105	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5880	ECME105	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5881	ECME105	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5882	ECME105	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5883	ECME105	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5884	ECME105	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5885	ECME105	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5886	ECME105	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5887	ECME105	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5888	ECME105	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5889	ECME104	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5890	ECME104	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5891	ECME104	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5892	ECME104	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5893	ECME104	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5894	ECME104	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5895	ECME104	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5896	ECME104	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5897	ECME104	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5898	ECME104	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5899	ECME104	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5900	ECME104	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5901	ECME104	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5902	ECME104	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5903	ECME104	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5904	ECME104	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5905	ECME104	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5906	ECME104	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5907	ECME104	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5908	ECME103	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5909	ECME103	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5910	ECME103	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5911	ECME103	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5912	ECME103	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5913	ECME103	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5914	ECME103	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5915	ECME103	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5916	ECME103	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5917	ECME103	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5918	ECME103	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5919	ECME103	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5920	ECME103	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5921	ECME103	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5922	ECME103	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5923	ECME103	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5924	ECME103	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5925	ECME103	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5926	ECME103	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5927	ECME102	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5928	ECME102	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5929	ECME102	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5930	ECME102	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5931	ECME102	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5932	ECME102	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5933	ECME102	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5934	ECME102	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5935	ECME102	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5936	ECME102	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5937	ECME102	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5938	ECME102	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5939	ECME102	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5940	ECME102	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5941	ECME102	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5942	ECME102	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5943	ECME102	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5944	ECME102	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5945	ECME102	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5946	ECME101	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5947	ECME101	2008-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5948	ECME101	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5949	ECME101	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5950	ECME101	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5951	ECME101	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5952	ECME101	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5953	ECME101	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5954	ECME101	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5955	ECME101	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5956	ECME101	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5957	ECME101	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5958	ECME101	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5959	ECME101	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5960	ECME101	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5961	ECME101	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5962	ECME101	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5963	ECME101	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5964	ECME101	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5965	ECME100	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5966	ECME100	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5967	ECME100	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5968	ECME100	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5969	ECME100	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5970	ECME100	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5971	ECME100	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5972	ECME100	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5973	ECME100	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5974	ECME100	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5975	ECME100	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5976	ECME100	2018-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5977	ECME100	02/06/019	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5978	ECME100	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5979	ECME100	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5980	ECME100	2022-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5981	ECME100	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5982	ECME100	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5983	ECME100	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5984	ECME099	2007-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5985	ECME099	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5986	ECME099	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5987	ECME099	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5988	ECME099	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5989	ECME099	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5990	ECME099	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5991	ECME099	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5992	ECME099	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5993	ECME099	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5994	ECME099	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5995	ECME099	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5996	ECME099	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5997	ECME099	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5998	ECME099	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
5999	ECME099	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6000	ECME099	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6001	ECME099	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6002	ECME099	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6003	ECME098	2007-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6004	ECME098	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6005	ECME098	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6006	ECME098	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6007	ECME098	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6008	ECME098	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6009	ECME098	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6010	ECME098	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6011	ECME098	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6012	ECME098	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6013	ECME098	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6014	ECME098	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6015	ECME098	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6016	ECME098	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6017	ECME098	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6018	ECME098	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6019	ECME098	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6020	ECME098	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6021	ECME098	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6022	ECME097	2007-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6023	ECME097	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6024	ECME097	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6025	ECME097	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6026	ECME097	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6027	ECME097	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6028	ECME097	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6029	ECME097	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6030	ECME097	2015-06-01	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6031	ECME097	2016-06-01	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6032	ECME097	2017-05-31	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6033	ECME097	2018-06-02	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6034	ECME097	2019-06-01	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6035	ECME097	2020-05-25	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6036	ECME097	2021-05-24	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6037	ECME097	2022-05-25	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6038	ECME097	2023-05-24	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6039	ECME097	2024-05-23	vérification	non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6040	ECME097	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6041	ECME096	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6042	ECME096	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6043	ECME096	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6044	ECME096	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6045	ECME096	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6046	ECME096	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6047	ECME096	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6048	ECME096	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6049	ECME096	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6050	ECME096	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6051	ECME096	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6052	ECME096	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6053	ECME096	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6054	ECME096	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6055	ECME096	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6056	ECME096	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6057	ECME096	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6058	ECME096	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6059	ECME095	2007-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6060	ECME095	2008-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6061	ECME095	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6062	ECME095	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6063	ECME095	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6064	ECME095	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6065	ECME095	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6066	ECME095	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6067	ECME095	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6068	ECME095	2016-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6069	ECME095	2017-05-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6070	ECME095	2018-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6071	ECME095	2019-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6072	ECME095	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6073	ECME095	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6074	ECME095	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6075	ECME095	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6076	ECME095	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6077	ECME095	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6078	ECME088	2017-11-16	testeur défectueux	changement du 2 circuit intégrer	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6079	ECME088	2019-04-15	testeur défectueux	changement une circuit intégrer573N	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6080	ECME080	2007-01-03	vérification	conforme d'aprét le client ( rapport non recu )	H.imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6081	ECME080	2009-01-26	vérification	conforme d'aprét le client ( rapport non recu )	H.imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6082	ECME080	2011-03-27	vérification	conforme d'aprét le client ( rapport non recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6083	ECME080	2012-06-18	vérification	conforme d'aprét le client ( rapport non recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6084	ECME080	2014-09-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6085	ECME080	2016-11-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6086	ECME080	2018-11-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6087	ECME079	2008-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6088	ECME079	2008-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6089	ECME079	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6090	ECME079	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6091	ECME079	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6092	ECME079	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6093	ECME079	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6094	ECME079	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6095	ECME079	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6096	ECME079	2016-05-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6097	ECME079	2017-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6098	ECME079	2018-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6099	ECME079	2019-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6100	ECME079	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6101	ECME079	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6102	ECME079	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6103	ECME079	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6104	ECME079	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6105	ECME079	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6106	ECME077	2007-04-09	vérification	conforme d'aprét le client ( rapport non recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6107	ECME077	2008-05-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6108	ECME077	2009-05-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6109	ECME077	2009-08-27	retour au client pour réparation	réparation connectique défectueuse 08-09-2009	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6110	ECME077	2010-05-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6111	ECME077	2011-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6112	ECME077	2012-05-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6113	ECME077	2013-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6114	ECME077	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6115	ECME077	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6116	ECME077	2017-01-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6117	ECME077	2018-01-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6118	ECME077	2019-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6119	ECME077	2020-01-29	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6120	ECME077	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6121	ECME077	2023-04-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6122	ECME077	2024-05-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6123	ECME077	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6124	ECME076	2007-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6125	ECME076	2008-04-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6126	ECME076	2009-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6127	ECME076	2010-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6128	ECME076	2011-05-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6129	ECME076	2012-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6130	ECME076	2013-05-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6131	ECME076	2014-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6132	ECME076	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6133	ECME076	2016-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6134	ECME076	2017-12-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6135	ECME076	2018-12-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6136	ECME076	2020-01-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6137	ECME076	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6138	ECME076	2022-04-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6139	ECME076	2023-04-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6140	ECME076	2024-05-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6141	ECME076	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6142	ECME075	2006-09-30	vérification	confome d'après le client  ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6143	ECME075	2008-04-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6144	ECME075	2009-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6145	ECME075	2010-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6146	ECME075	2011-05-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6147	ECME075	2012-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6148	ECME075	2013-05-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6149	ECME075	2014-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6150	ECME075	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6151	ECME075	2016-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6152	ECME075	2017-12-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6153	ECME075	2018-12-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6154	ECME075	2020-01-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6155	ECME075	2021-03-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6156	ECME075	2022-04-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6157	ECME075	2023-03-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6158	ECME075	2024-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6159	ECME075	2025-07-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6160	ECME074	2008-04-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6161	ECME074	2009-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6162	ECME074	2010-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6163	ECME074	2011-05-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6164	ECME074	2012-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6165	ECME074	2013-05-30	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6166	ECME074	2014-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6167	ECME074	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6168	ECME074	2016-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6169	ECME074	2017-12-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6170	ECME074	2018-12-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6171	ECME074	2020-01-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6172	ECME074	2021-03-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6173	ECME074	2022-04-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6174	ECME074	2023-04-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6175	ECME074	2024-05-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6176	ECME074	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6177	ECME073	2007-01-17	vérification	Conforme (Tolérence maximum 0,022)	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6178	ECME073	2008-02-18	vérification	Conforme (Tolérence maximum 0,022)	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6179	ECME073	2009-02-17	vérification	Conforme (Tolérence maximum 0,022)	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6180	ECME073	2010-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6181	ECME073	2011-02-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6182	ECME073	2012-03-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6183	ECME073	2013-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6184	ECME073	2014-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6185	ECME073	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6186	ECME073	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6187	ECME073	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6188	ECME073	2018-05-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6189	ECME073	2019-06-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6190	ECME073	2020-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6191	ECME073	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6192	ECME073	2022-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6193	ECME073	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6194	ECME073	2024-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6195	ECME072	2011-04-27	déclasser définitive		imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6196	ECME071	2007-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6197	ECME071	2008-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6198	ECME071	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6199	ECME071	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6200	ECME071	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6201	ECME071	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6202	ECME071	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6203	ECME071	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6204	ECME071	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6205	ECME071	2016-05-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6206	ECME071	2017-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6207	ECME071	2018-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6208	ECME071	2019-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6209	ECME071	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6210	ECME071	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6211	ECME071	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6212	ECME071	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6213	ECME071	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6214	ECME071	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6215	ECME070	2007-05-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6216	ECME070	2008-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6217	ECME070	2009-05-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6218	ECME070	2010-05-11	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6219	ECME070	2011-05-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6220	ECME070	2012-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6221	ECME070	2013-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6222	ECME070	2014-06-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6223	ECME070	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6224	ECME070	2016-11-25	vérification	Non conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6225	ECME067	2007-01-17	vérification	conforme	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6226	ECME067	2008-02-18	vérification	conforme	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6227	ECME067	2009-02-17	vérification	conforme	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6228	ECME067	2010-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6229	ECME067	2011-02-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6230	ECME067	2012-03-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6231	ECME067	2013-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6232	ECME067	2014-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6233	ECME067	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6234	ECME067	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6235	ECME067	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6236	ECME067	2018-05-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6237	ECME067	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6238	ECME067	2020-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6239	ECME067	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6240	ECME067	2022-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6241	ECME067	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6242	ECME067	2024-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6243	ECME066	2007-01-17	vérification	conforme	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6244	ECME066	2008-04-28	vérification	conforme	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6245	ECME066	2009-05-06	vérification	conforme	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6246	ECME066	2010-05-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6247	ECME066	2011-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6248	ECME066	2012-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6249	ECME066	2013-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6250	ECME066	2014-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6251	ECME066	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6252	ECME066	2016-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6253	ECME066	2017-12-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6254	ECME066	2018-12-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6255	ECME066	2020-01-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6256	ECME066	2021-03-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6257	ECME066	2022-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6258	ECME066	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6259	ECME066	2024-09-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6260	ECME066	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6261	ECME061	2007-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6262	ECME061	2008-05-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6263	ECME061	2009-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6264	ECME061	2010-06-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6265	ECME061	2011-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6266	ECME061	2013-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6267	ECME061	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6268	ECME061	2015-06-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6269	ECME061	2016-05-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6270	ECME061	2017-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6271	ECME061	2018-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6272	ECME061	2019-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6273	ECME061	2020-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6274	ECME061	2021-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6275	ECME061	2022-05-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6276	ECME061	2023-05-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6277	ECME061	2024-05-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6278	ECME061	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6279	ECME060	2018-07-12	Retour au client définitive		imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6280	ECME058	2007-01-17	vérification	conforme	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6281	ECME058	2008-02-18	vérification	conforme	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6282	ECME058	2009-02-17	vérification	conforme	IMED.H	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6283	ECME058	2010-02-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6284	ECME058	2011-02-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6285	ECME058	2012-03-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6286	ECME058	2013-04-15	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6287	ECME058	2014-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6288	ECME058	2015-04-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6289	ECME058	2016-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6290	ECME058	2017-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6291	ECME058	2018-05-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6292	ECME058	2019-06-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6293	ECME058	2020-06-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6294	ECME058	2021-10-14	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6295	ECME058	2022-10-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6296	ECME058	2023-10-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6297	ECME058	2024-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6298	ECME057	2007-04-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6299	ECME057	2008-05-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6300	ECME057	2009-05-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6301	ECME057	2010-05-06	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6302	ECME057	2011-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6303	ECME057	2012-05-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6304	ECME057	2013-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6305	ECME057	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6306	ECME057	2015-08-28	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6307	ECME057	2017-01-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6308	ECME057	2018-01-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6309	ECME057	2019-01-21	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6310	ECME057	28/01/20120	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6311	ECME057	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6312	ECME057	2022-04-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6313	ECME057	2023-03-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6314	ECME057	2024-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6315	ECME057	2025-07-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6316	ECME056	2005-09-19	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6317	ECME056	2007-09-20	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6318	ECME056	2009-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6319	ECME056	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6320	ECME056	2014-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6321	ECME056	2016-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6322	ECME056	2018-12-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6323	ECME056	2021-01-31	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6324	ECME056	2023-12-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6325	ECME055	2005-09-19	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6326	ECME055	2007-09-20	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6327	ECME055	2009-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6328	ECME055	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6329	ECME055	2013-10-23	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6330	ECME055	2014-09-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6331	ECME055	2016-11-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6332	ECME055	2018-12-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6333	ECME055	2020-12-20	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6334	ECME055	2023	declasser definitive		imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6335	ECME054	2007-09-25	vérification	conforme d'après le client (pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6336	ECME054	2009-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6337	ECME054	2010-08-29	changement une touche contacte	bon	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6338	ECME054	2010-10-28	changement un variateur 10K 0,074A	bon	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6339	ECME054	2011-04-19	vérification	conforme d'après le client (pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6340	ECME054	2011-05-18	mauves contacte du relais	changement du touche contact	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6341	ECME054	2013-05-26	vérification	conforme d'après le client (pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6342	ECME054	2016-01-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6343	ECME054	2017-07-13	retour au client définitivement		imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6344	ECME053	2005-09-19	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6345	ECME053	2007-09-20	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6346	ECME053	2009-09-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6347	ECME053	2012-06-18	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6348	ECME053	2014-09-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6349	ECME053	2016-11-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6350	ECME053	2018-12-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6351	ECME053	2020-12-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6352	ECME053	2023-12-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6353	ECME052	2005-06-07	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6354	ECME052	2007-07-12	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6355	ECME052	2009-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6356	ECME052	2012-06-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6357	ECME052	2014-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6358	ECME052	2016-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6359	ECME052	2017-07-13	retour au client définitivement		imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6360	ECME051	2005-06-12	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6361	ECME051	2007-07-15	vérification	conforme d'après le client ( pas de rapport recu )	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6362	ECME051	2009-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6363	ECME051	2012-06-05	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6364	ECME051	2014-09-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6365	ECME051	2016-11-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6366	ECME051	2017-07-13	retour au client définitivement		Imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6367	ECME049	2015-05-13	Réparation (Banc HS)	bon	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6368	ECME046	2009-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6369	ECME046	2010-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6370	ECME046	2011-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6371	ECME046	2012-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6372	ECME046	2013-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6373	ECME046	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6374	ECME046	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6375	ECME046	2016-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6376	ECME046	2017-12-04	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6377	ECME046	2018-12-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6378	ECME046	2020-01-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6379	ECME046	2021-03-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6380	ECME046	2022-04-25	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6381	ECME046	2023-09-01	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6382	ECME046	2024-09-13	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6383	ECME046	2025-10-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6384	ECME045	2009-05-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6385	ECME045	2010-05-12	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6386	ECME045	2011-05-17	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6387	ECME045	2012-05-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6388	ECME045	2013-05-27	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6389	ECME045	2014-06-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6390	ECME045	2015-06-16	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6391	ECME045	2016-11-24	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6392	ECME045	2017-12-07	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6393	ECME045	2018-12-09	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6394	ECME045	2020-01-10	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6395	ECME045	2021-03-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6396	ECME045	2022-04-02	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6397	ECME045	2023-04-19	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6398	ECME045	2024-05-03	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6399	ECME045	2025-05-22	vérification	conforme	imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
6400	ECME042	2018-07-12	Retour au client définitive		imed	2026-04-22 14:15:12.823+01	2026-04-22 14:15:12.823+01
\.


--
-- TOC entry 5691 (class 0 OID 24691)
-- Dependencies: 242
-- Data for Name: equipements; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.equipements (id, code_rai, designation, numero_serie, date_acquisition, remarque, statut, "createdAt", "updatedAt", zone_id, fabricant_id, categorie, pdr_details) FROM stdin;
1	EQUIP151	Machine de bobinage	7287	\N	\N	En service	2026-02-24 03:52:07.754+01	2026-02-24 03:52:07.754+01	1	1	equipement	\N
2	EQUIP152	Machine de bobinage	1011145	\N	VIS + COURROIES	Hors service	2026-02-24 03:52:07.761+01	2026-02-24 03:52:07.761+01	1	1	equipement	\N
3	EQUIP153	Machine de bobinage	7137	\N	Déclassé	Hors service	2026-02-24 03:52:07.764+01	2026-02-24 03:52:07.764+01	1	1	equipement	\N
4	EQUIP154	Machine de bobinage	7261	\N	\N	En service	2026-02-24 03:52:07.766+01	2026-02-24 03:52:07.766+01	1	1	equipement	\N
5	EQUIP155	Machine de bobinage	7216	\N	Vis sans fin	Hors service	2026-02-24 03:52:07.768+01	2026-02-24 03:52:07.768+01	1	1	equipement	\N
6	EQUIP156	Machine de bobinage	7403	\N	12/23/2024	En service	2026-02-24 03:52:07.771+01	2026-02-24 03:52:07.771+01	1	1	equipement	\N
7	EQUIP157	Machine de bobinage	7260	\N	\N	En service	2026-02-24 03:52:07.774+01	2026-02-24 03:52:07.774+01	1	1	equipement	\N
8	EQUIP158	Machine de bobinage	7286	\N	\N	En service	2026-02-24 03:52:07.776+01	2026-02-24 03:52:07.776+01	1	1	equipement	\N
9	EQUIP159	Machine de bobinage	1011144	\N	VIS + COURROIES	Hors service	2026-02-24 03:52:07.778+01	2026-02-24 03:52:07.778+01	1	1	equipement	\N
10	EQUIP160	Machine de bobinage	7413	\N	Déclassé	Hors service	2026-02-24 03:52:07.78+01	2026-02-24 03:52:07.78+01	1	1	equipement	\N
11	EQUIP161	Machine de bobinage	7410	\N	\N	En service	2026-02-24 03:52:07.782+01	2026-02-24 03:52:07.782+01	1	1	equipement	\N
12	EQUIP162	Machine de bobinage	8221640340	\N	\N	En service	2026-02-24 03:52:07.785+01	2026-02-24 03:52:07.785+01	1	2	equipement	\N
13	EQUIP167	Machine de bobinage	7404	\N	Déclassé	Hors service	2026-02-24 03:52:07.787+01	2026-02-24 03:52:07.787+01	1	1	equipement	\N
14	EQUIP168	Machine de bobinage	7247	\N	\N	En service	2026-02-24 03:52:07.79+01	2026-02-24 03:52:07.79+01	1	1	equipement	\N
15	EQUIP230	Machine de bobinage	1011146	\N	\N	En service	2026-02-24 03:52:07.792+01	2026-02-24 03:52:07.792+01	1	1	equipement	\N
16	EQUIP231	Machine de bobinage	1011147	\N	roue	Hors service	2026-02-24 03:52:07.795+01	2026-02-24 03:52:07.795+01	1	1	equipement	\N
17	EQUIP367	Machine de bobinage	602217.04.41	\N	\N	En service	2026-02-24 03:52:07.796+01	2026-02-24 03:52:07.796+01	1	1	equipement	\N
18	EQUIP308	Soudure à ultrasons	103100	\N	\N	En service	2026-02-24 03:52:07.799+01	2026-02-24 03:52:07.799+01	1	33	equipement	\N
19	EQUIP332	Machine de désémaillage	A5012	\N	\N	En service	2026-02-24 03:52:07.801+01	2026-02-24 03:52:07.801+01	1	34	equipement	\N
20	EQUIP148	Machine de bobinage	7807	\N	\N	En service	2026-02-24 03:52:07.804+01	2026-02-24 03:52:07.804+01	1	3	equipement	\N
21	EQUIP347	Machine de coupe	1170-2000	\N	installé le 04/02/2025	En service	2026-02-24 03:52:07.805+01	2026-02-24 03:52:07.805+01	2	4	equipement	\N
22	EQUIP210	Marquage à chaud	18101/93	\N	\N	En service	2026-02-24 03:52:07.807+01	2026-02-24 03:52:07.807+01	2	5	equipement	\N
23	EQUIP395	Machine de coupe	9700889	\N	\N	En service	2026-02-24 03:52:07.809+01	2026-02-24 03:52:07.809+01	2	6	equipement	\N
24	EQUIP432	Machine de coupe	20010744	\N	\N	En service	2026-02-24 03:52:07.81+01	2026-02-24 03:52:07.81+01	2	4	equipement	\N
25	EQUIP355	Machine de coupe	7	\N	\N	En service	2026-02-24 03:52:07.812+01	2026-02-24 03:52:07.812+01	2	4	equipement	\N
26	EQUIP349	Machine de marquage	MID060 035714	\N	\N	En service	2026-02-24 03:52:07.814+01	2026-02-24 03:52:07.814+01	2	4	equipement	\N
27	EQUIP431	Machine de marquage	MID060-043536	\N	\N	En service	2026-02-24 03:52:07.816+01	2026-02-24 03:52:07.816+01	2	4	equipement	\N
28	EQUIP476	Machine de dégunage	\N	\N	\N	En service	2026-02-24 03:52:07.818+01	2026-02-24 03:52:07.818+01	2	35	equipement	\N
29	EQUIP475	Machine de coupe	\N	\N	\N	En service	2026-02-24 03:52:07.82+01	2026-02-24 03:52:07.82+01	2	35	equipement	\N
30	EQUIP353	Bottleuse	9108	\N	\N	En service	2026-02-24 03:52:07.821+01	2026-02-24 03:52:07.821+01	2	8	equipement	\N
31	EQUIP457	Bottleuse	12324	\N	\N	En service	2026-02-24 03:52:07.823+01	2026-02-24 03:52:07.823+01	2	8	equipement	\N
32	EQUIP444	Machine de sertissage	0481-03000	\N	\N	En service	2026-02-24 03:52:07.825+01	2026-02-24 03:52:07.825+01	2	7	equipement	\N
33	EQUIP386	Presse manuel	1780	\N	\N	En service	2026-02-24 03:52:07.827+01	2026-02-24 03:52:07.827+01	2	7	equipement	\N
34	EQUIP305	Machine de sertissage	776-2012	\N	\N	En service	2026-02-24 03:52:07.829+01	2026-02-24 03:52:07.829+01	2	4	equipement	\N
35	EQUIP342	Machine de sertissage	1316	\N	\N	En service	2026-02-24 03:52:07.831+01	2026-02-24 03:52:07.831+01	2	4	equipement	\N
36	EQUIP343	Machine de sertissage	1315	\N	\N	En service	2026-02-24 03:52:07.833+01	2026-02-24 03:52:07.833+01	2	4	equipement	\N
37	EQUIP450	Machine de sertissage	10577SL	\N	\N	En service	2026-02-24 03:52:07.835+01	2026-02-24 03:52:07.835+01	2	9	equipement	\N
38	EQUIP190	Machine de sertissage	9342 L	\N	\N	En service	2026-02-24 03:52:07.836+01	2026-02-24 03:52:07.836+01	2	9	equipement	\N
39	EQUIP385	Machine de sertissage	10576 SL	\N	\N	En service	2026-02-24 03:52:07.838+01	2026-02-24 03:52:07.838+01	2	9	equipement	\N
40	EQUIP391	Machine coupe gain	90033852	\N	\N	En service	2026-02-24 03:52:07.84+01	2026-02-24 03:52:07.84+01	2	10	equipement	\N
41	EQUIP458	Machine de sertissage	88364	\N	\N	En service	2026-02-24 03:52:07.842+01	2026-02-24 03:52:07.842+01	2	11	equipement	\N
42	EQUIP340	Machine de dénudage	2151480	\N	\N	En service	2026-02-24 03:52:07.843+01	2026-02-24 03:52:07.843+01	2	12	equipement	\N
43	EQUIP463	Machine de dénudage	EL	\N	\N	En service	2026-02-24 03:52:07.845+01	2026-02-24 03:52:07.845+01	2	35	equipement	\N
44	EQUIP459	Machine de dénudage	CF1	\N	\N	En service	2026-02-24 03:52:07.847+01	2026-02-24 03:52:07.847+01	2	35	equipement	\N
45	EQUIP460	Machine de dénudage	CF2	\N	\N	En service	2026-02-24 03:52:07.849+01	2026-02-24 03:52:07.849+01	2	35	equipement	\N
46	EQUIP461	Machine de dénudage	CF3	\N	\N	En service	2026-02-24 03:52:07.851+01	2026-02-24 03:52:07.851+01	2	35	equipement	\N
47	EQUIP462	Machine de dénudage	CF4	\N	\N	En service	2026-02-24 03:52:07.853+01	2026-02-24 03:52:07.853+01	2	35	equipement	\N
48	EQUIP464	Machine de dénudage	EA	\N	\N	En service	2026-02-24 03:52:07.855+01	2026-02-24 03:52:07.855+01	2	35	equipement	\N
49	EQUIP341	Machine d'insertion embout	181484	\N	\N	En service	2026-02-24 03:52:07.857+01	2026-02-24 03:52:07.857+01	2	12	equipement	\N
50	EQUIP384	Machine ULTRASON	8737009	\N	\N	En service	2026-02-24 03:52:07.858+01	2026-02-24 03:52:07.858+01	2	13	equipement	\N
51	EQUIP473	Machine ULTRASON	BN2030A	\N	\N	En service	2026-02-24 03:52:07.86+01	2026-02-24 03:52:07.86+01	2	35	equipement	\N
52	EQUIP094	Soudeuse électrique	4092640	\N	\N	En service	2026-02-24 03:52:07.862+01	2026-02-24 03:52:07.862+01	2	14	equipement	\N
53	EQUIP297	Poste coupe lame	78591	\N	\N	En service	2026-02-24 03:52:07.864+01	2026-02-24 03:52:07.864+01	2	15	equipement	\N
54	EQUIP147	Presse de sertissage	\N	\N	\N	En service	2026-02-24 03:52:07.865+01	2026-02-24 03:52:07.865+01	2	16	equipement	\N
55	EQUIP144	Poste Marquage	\N	\N	\N	En service	2026-02-24 03:52:07.867+01	2026-02-24 03:52:07.867+01	2	17	equipement	\N
56	EQUIP061	Presse de sertissage	A0166	\N	\N	En service	2026-02-24 03:52:07.87+01	2026-02-24 03:52:07.87+01	2	18	equipement	\N
57	EQUIP254	Presse de sertissage Broche	A0104	\N	\N	En service	2026-02-24 03:52:07.872+01	2026-02-24 03:52:07.872+01	2	18	equipement	\N
58	EQUIP039	Presse insertion broche CA	74A395	\N	\N	En service	2026-02-24 03:52:07.873+01	2026-02-24 03:52:07.873+01	2	19	equipement	\N
59	EQUIP046	Presse montage volet	71088.3	\N	\N	En service	2026-02-24 03:52:07.875+01	2026-02-24 03:52:07.875+01	2	19	equipement	\N
60	EQUIP124	Equilibrage	\N	\N	\N	En service	2026-02-24 03:52:07.877+01	2026-02-24 03:52:07.877+01	2	\N	equipement	\N
61	EQUIP082	Presse montage volet CAP	74A395	\N	\N	En service	2026-02-24 03:52:07.878+01	2026-02-24 03:52:07.878+01	2	19	equipement	\N
62	EQUIP092	Machine soudage	F123	\N	\N	En service	2026-02-24 03:52:07.881+01	2026-02-24 03:52:07.881+01	2	20	equipement	\N
63	EQUIP090	Marquage à chaud	\N	\N	\N	En service	2026-02-24 03:52:07.883+01	2026-02-24 03:52:07.883+01	2	\N	equipement	\N
64	EQUIP312	Presse de sertissage	\N	\N	\N	En service	2026-02-24 03:52:07.885+01	2026-02-24 03:52:07.885+01	2	21	equipement	\N
65	EQUIP038	Presse de sertissage	8647	\N	\N	En service	2026-02-24 03:52:07.887+01	2026-02-24 03:52:07.887+01	2	21	equipement	\N
66	EQUIP057	Presse de sertissage	\N	\N	\N	En service	2026-02-24 03:52:07.889+01	2026-02-24 03:52:07.889+01	2	\N	equipement	\N
67	EQUIP316	Presse de sertissage	2131E.C	\N	\N	En service	2026-02-24 03:52:07.89+01	2026-02-24 03:52:07.89+01	2	22	equipement	\N
68	EQUIP196	Presse de sertissage	3_80	\N	\N	En service	2026-02-24 03:52:07.892+01	2026-02-24 03:52:07.892+01	2	23	equipement	\N
69	EQUIP197	Presse de sertissage	2 71	\N	\N	En service	2026-02-24 03:52:07.894+01	2026-02-24 03:52:07.894+01	2	18	equipement	\N
70	EQUIP198	Presse de sertissage Torniquée	116	\N	\N	En service	2026-02-24 03:52:07.895+01	2026-02-24 03:52:07.895+01	2	18	equipement	\N
71	EQUIP138	Presse de sertissage	354034	\N	\N	En service	2026-02-24 03:52:07.897+01	2026-02-24 03:52:07.897+01	2	24	equipement	\N
72	EQUIP189	Poste d'insertion	\N	\N	\N	En service	2026-02-24 03:52:07.899+01	2026-02-24 03:52:07.899+01	2	\N	equipement	\N
73	EQUIP191	Presse de sertissage	181164.355	\N	changement joint kw39	En service	2026-02-24 03:52:07.9+01	2026-02-24 03:52:07.9+01	2	25	equipement	\N
74	EQUIP202	Perceuse noyau	4322	\N	\N	En service	2026-02-24 03:52:07.902+01	2026-02-24 03:52:07.902+01	2	26	equipement	\N
75	EQUIP203	Poste d'insertion noyau	\N	\N	\N	En service	2026-02-24 03:52:07.903+01	2026-02-24 03:52:07.903+01	2	\N	equipement	\N
76	EQUIP201	Presse de sertissage Torniquée	139	\N	\N	En service	2026-02-24 03:52:07.905+01	2026-02-24 03:52:07.905+01	2	18	equipement	\N
77	EQUIP199	Presse de sertissage	4503	\N	\N	En service	2026-02-24 03:52:07.907+01	2026-02-24 03:52:07.907+01	2	27	equipement	\N
78	EQUIP200	Presse de sertissage	51109	\N	\N	En service	2026-02-24 03:52:07.909+01	2026-02-24 03:52:07.909+01	2	27	equipement	\N
79	EQUIP220	Presse de sertissage	946666	\N	\N	En service	2026-02-24 03:52:07.91+01	2026-02-24 03:52:07.91+01	2	28	equipement	\N
80	EQUIP346	Machine à vague	W002B-0710456	\N	\N	En service	2026-02-24 03:52:07.913+01	2026-02-24 03:52:07.913+01	4	29	equipement	\N
81	EQUIP466	Machine de lavage	130613/1	\N	\N	En service	2026-02-24 03:52:07.914+01	2026-02-24 03:52:07.914+01	4	29	equipement	\N
82	EQUIP495	Machine de coupe PCB	WDD 81 V	\N	\N	En service	2026-02-24 03:52:07.916+01	2026-02-24 03:52:07.916+01	4	\N	equipement	\N
83	EQUIP241	Pompe à dessouder	4740101127	\N	PB élément chauffant	Hors service	2026-02-24 03:52:07.918+01	2026-02-24 03:52:07.918+01	4	30	equipement	\N
84	EQUIP005	Insertion cosse	10010	\N	\N	En service	2026-02-24 03:52:07.92+01	2026-02-24 03:52:07.92+01	4	31	equipement	\N
85	EQUIP508	Pompe à dessouder	984	\N	\N	En service	2026-02-24 03:52:07.921+01	2026-02-24 03:52:07.921+01	4	35	equipement	\N
86	EQUIP208	Fer à souder	07-89 53210599	\N	Sans plomb	En service	2026-02-24 03:52:07.923+01	2026-02-24 03:52:07.923+01	4	32	equipement	\N
88	EQUIP311	Fer à souder	192	\N	Sans plomb	En service	2026-02-24 03:52:07.926+01	2026-02-24 03:52:07.926+01	9	32	equipement	\N
89	EQUIP031	Fer à souder	\N	\N	Sans plomb	En service	2026-02-24 03:52:07.928+01	2026-02-24 03:52:07.928+01	6	32	equipement	\N
90	EQUIP205	Fer à souder	589	\N	Sans plomb	En service	2026-02-24 03:52:07.93+01	2026-02-24 03:52:07.93+01	4	32	equipement	\N
91	EQUIP377	Fer à souder	08648/172530	\N	Avec plomb	En service	2026-02-24 03:52:07.932+01	2026-02-24 03:52:07.932+01	7	32	equipement	\N
92	EQUIP025	Fer à souder	0053102698/04-01	\N	Avec plomb	En service	2026-02-24 03:52:07.933+01	2026-02-24 03:52:07.933+01	6	32	equipement	\N
93	EQUIP129	Fer à souder	0053102698/01-99	\N	Avec plomb	Hors service	2026-02-24 03:52:07.935+01	2026-02-24 03:52:07.935+01	6	32	equipement	\N
94	EQUIP411	Fer à souder	087 37/20 4896	\N	Sans plomb	En service	2026-02-24 03:52:07.937+01	2026-02-24 03:52:07.937+01	4	32	equipement	\N
95	EQUIP393	Fer à souder	08603/180336	\N	Sans plomb	En service	2026-02-24 03:52:07.938+01	2026-02-24 03:52:07.938+01	4	32	equipement	\N
96	EQUIP018	Fer à souder	53201499/01-95	\N	Sans plomb	En service	2026-02-24 03:52:07.94+01	2026-02-24 03:52:07.94+01	4	32	equipement	\N
97	EQUIP204	Fer à souder	08-91 53210599	\N	Sans plomb	En service	2026-02-24 03:52:07.941+01	2026-02-24 03:52:07.941+01	4	32	equipement	\N
98	EQUIP309	Fer à souder	189	\N	Sans plomb	En service	2026-02-24 03:52:07.943+01	2026-02-24 03:52:07.943+01	4	32	equipement	\N
99	EQUIP410	Fer à souder	087 37/20 4892	\N	Sans plomb	En service	2026-02-24 03:52:07.945+01	2026-02-24 03:52:07.945+01	4	32	equipement	\N
100	EQUIP412	Fer à souder	087 37/20 4893	\N	Sans plomb	En service	2026-02-24 03:52:07.946+01	2026-02-24 03:52:07.946+01	4	32	equipement	\N
101	EQUIP310	Fer à souder	490	\N	Sans plomb	En service	2026-02-24 03:52:07.948+01	2026-02-24 03:52:07.948+01	4	32	equipement	\N
102	EQUIP482	Fer à souder	086 48/17 2528	\N	Sans plomb	En service	2026-02-24 03:52:07.95+01	2026-02-24 03:52:07.95+01	4	32	equipement	\N
103	EQUIP062	Fer à souder	100W/230V	\N	Sans plomb	En service	2026-02-24 03:52:07.951+01	2026-02-24 03:52:07.951+01	10	32	equipement	\N
104	EQUIP406	Fer à souder	100W/230V	\N	Sans plomb	En service	2026-02-24 03:52:07.953+01	2026-02-24 03:52:07.953+01	10	32	equipement	\N
105	EQUIP404	Fer à souder	086 48/17 2527	\N	Sans plomb	En service	2026-02-24 03:52:07.955+01	2026-02-24 03:52:07.955+01	10	32	equipement	\N
106	EQUIP379	Fer à souder	08648/17 2525	\N	Sans plomb	En service	2026-02-24 03:52:07.957+01	2026-02-24 03:52:07.957+01	8	32	equipement	\N
107	EQUIP375	Fer à souder	086 48/17 2529	\N	Sans plomb	En service	2026-02-24 03:52:07.958+01	2026-02-24 03:52:07.958+01	7	32	equipement	\N
108	EQUIP113	Fer à souder	288	\N	Avec plomb	En service	2026-02-24 03:52:07.96+01	2026-02-24 03:52:07.96+01	6	32	equipement	\N
109	EQUIP480	Fer à souder	086 03/18 0340	\N	Sans plomb	En service	2026-02-24 03:52:07.961+01	2026-02-24 03:52:07.961+01	8	32	equipement	\N
110	EQUIP407	Fer à souder	100W/230V	\N	Sans plomb	En service	2026-02-24 03:52:07.963+01	2026-02-24 03:52:07.963+01	4	32	equipement	\N
111	EQUIP505	Bain creuset	ZTX-A150W	\N	Sans plomb — PB Résistance	En service	2026-02-24 03:52:07.965+01	2026-02-24 03:52:07.965+01	1	\N	equipement	\N
112	EQUIP503	Bain creuset	309230039	\N	Sans plomb	En service	2026-02-24 03:52:07.967+01	2026-02-24 03:52:07.967+01	1	\N	equipement	\N
113	EQUIP376	Bain creuset	\N	\N	Sans plomb	En service	2026-02-24 03:52:07.968+01	2026-02-24 03:52:07.968+01	1	\N	equipement	\N
114	EQUIP288	Bain creuset	09207/106816	\N	Avec plomb	En service	2026-02-24 03:52:07.97+01	2026-02-24 03:52:07.97+01	1	32	equipement	\N
115	EQUIP195	Bain creuset	92.047	\N	Sans plomb	En service	2026-02-24 03:52:07.972+01	2026-02-24 03:52:07.972+01	5	2	equipement	\N
116	EQUIP207	Bain creuset	\N	\N	Sans plomb	En service	2026-02-24 03:52:07.973+01	2026-02-24 03:52:07.973+01	5	2	equipement	\N
117	EQUIP289	Bain creuset	09207/107667	\N	Sans plomb	En service	2026-02-24 03:52:07.975+01	2026-02-24 03:52:07.975+01	6	32	equipement	\N
118	EQUIP225	Bain creuset	\N	\N	Avec plomb	En service	2026-02-24 03:52:07.977+01	2026-02-24 03:52:07.977+01	6	2	equipement	\N
119	EQUIP035	Bain creuset	\N	\N	Sans plomb	En service	2026-02-24 03:52:07.979+01	2026-02-24 03:52:07.979+01	4	\N	equipement	\N
120	EQUIP485	Bain creuset	\N	\N	Sans plomb	Hors service	2026-02-24 03:52:07.981+01	2026-02-24 03:52:07.981+01	7	35	equipement	\N
121	EQUIP515	Bain creuset	\N	\N	Sans plomb	En service	2026-02-24 03:52:07.983+01	2026-02-24 03:52:07.983+01	7	35	equipement	\N
122	EQUIP514	Bain creuset	\N	\N	Sans plomb	En service	2026-02-24 03:52:07.985+01	2026-02-24 03:52:07.985+01	7	35	equipement	\N
123	EQUIP510	Fer à souder	8702241196	\N	Sans plomb	En service	2026-02-24 03:52:07.987+01	2026-02-24 03:52:07.987+01	7	32	equipement	\N
124	EQUIP511	Fer à souder	8702240680	\N	Sans plomb	En service	2026-02-24 03:52:07.989+01	2026-02-24 03:52:07.989+01	7	32	equipement	\N
125	EQUIP512	Fer à souder	8702241181	\N	Sans plomb	En service	2026-02-24 03:52:07.991+01	2026-02-24 03:52:07.991+01	7	32	equipement	\N
126	EQUIP513	Fer à souder	8702241199	\N	Sans plomb	En service	2026-02-24 03:52:07.993+01	2026-02-24 03:52:07.993+01	7	32	equipement	\N
274	PDR-EQUIP449_A38C	WEIJONG/WJ-1800S / EQUIP449/A38C	270615860 / M34S75C4F2	\N	Terminal fournisseur: M34S75C4F2 | Terminal TEC: 270615860 | Lame cuivre: 3.0*1.4 x 0 | Lame isolant: 2.6*1.6 x 0 | Enclume cuivre: 3.2*1.4 x 0 | Enclume isolant: 2.6*1.6 x 0 | Lame de denudage (jeux): 0	En service	2026-04-22 14:15:11.148+01	2026-04-22 14:15:11.148+01	8	64	pdr	{"ref_applicateur_tec":"EQUIP449/A38C","ref_terminal_fournisseur":"M34S75C4F2","ref_terminal_tec":"270615860","lame_cuivre":{"reference":"3.0*1.4","quantity":"0"},"lame_isolant":{"reference":"2.6*1.6","quantity":"0"},"enclume_cuivre":{"reference":"3.2*1.4","quantity":"0"},"enclume_isolant":{"reference":"2.6*1.6","quantity":"0"},"lame_denudage_jeux":"0"}
275	PDR-EQUIP467_A38	WEIJONG/ 3 T / EQUIP467/A38	270608560 / 1060-16-0122	\N	Terminal fournisseur: 1060-16-0122 | Terminal TEC: 270608560 | Lame cuivre: 2.4*2.8 x 5 | Lame isolant: 3.5*3.2 x 6 | Enclume cuivre: 2.6*2.8 x 5 | Enclume isolant: 3.5*3.2 x 5 | Lame de denudage (jeux): 6 | Complements: TEC 270608760	En service	2026-04-22 14:15:11.196+01	2026-04-22 14:15:11.196+01	8	65	pdr	{"ref_applicateur_tec":"EQUIP467/A38","ref_terminal_fournisseur":"1060-16-0122","ref_terminal_tec":"270608560","lame_cuivre":{"reference":"2.4*2.8","quantity":"5"},"lame_isolant":{"reference":"3.5*3.2","quantity":"6"},"enclume_cuivre":{"reference":"2.6*2.8","quantity":"5"},"enclume_isolant":{"reference":"3.5*3.2","quantity":"5"},"lame_denudage_jeux":"6"}
276	PDR-EQUIP469_A39	WEIJONG/ 3 T / EQUIP469/A39	270610660 / 1060-16-1222	\N	Terminal fournisseur: 1060-16-1222 | Terminal TEC: 270610660 | Lame cuivre: 3.6*2.8 x 6 | Lame isolant: 3.8*3.2 x 6 | Enclume cuivre: 3.8*2.8 x 5 | Enclume isolant: 3.8*3.2 x 5 | Lame de denudage (jeux): 6 | Complements: TEC 270610680	En service	2026-04-22 14:15:11.2+01	2026-04-22 14:15:11.2+01	8	65	pdr	{"ref_applicateur_tec":"EQUIP469/A39","ref_terminal_fournisseur":"1060-16-1222","ref_terminal_tec":"270610660","lame_cuivre":{"reference":"3.6*2.8","quantity":"6"},"lame_isolant":{"reference":"3.8*3.2","quantity":"6"},"enclume_cuivre":{"reference":"3.8*2.8","quantity":"5"},"enclume_isolant":{"reference":"3.8*3.2","quantity":"5"},"lame_denudage_jeux":"6"}
277	PDR-EQUIP471_A40	WEIJONG/WJ-1800S / EQUIP471/A40	270567042 / 4250000872	\N	Terminal fournisseur: 4250000872 | Terminal TEC: 270567042 | Lame cuivre: 3.5*2.0 x 2 | Lame isolant: 2.6*2.5 x 2 | Enclume cuivre: 3.7*2.0 x 2 | Enclume isolant: 2.6*2.5 x 2 | Lame de denudage (jeux): 1	En service	2026-04-22 14:15:11.211+01	2026-04-22 14:15:11.211+01	8	64	pdr	{"ref_applicateur_tec":"EQUIP471/A40","ref_terminal_fournisseur":"4250000872","ref_terminal_tec":"270567042","lame_cuivre":{"reference":"3.5*2.0","quantity":"2"},"lame_isolant":{"reference":"2.6*2.5","quantity":"2"},"enclume_cuivre":{"reference":"3.7*2.0","quantity":"2"},"enclume_isolant":{"reference":"2.6*2.5","quantity":"2"},"lame_denudage_jeux":"1"}
278	PDR-EQUIP470_A41	WEIJONG/ 3 T / EQUIP470/A41	270567043 / 4250000873	\N	Terminal fournisseur: 4250000873 | Terminal TEC: 270567043 | Lame cuivre: 3.5*2.2 x 3 | Lame isolant: 2.6*2.6 x 3 | Enclume cuivre: 3.7*2.2 x 3 | Enclume isolant: 2.6*2.6 x 3 | Lame de denudage (jeux): 3	En service	2026-04-22 14:15:11.219+01	2026-04-22 14:15:11.219+01	8	65	pdr	{"ref_applicateur_tec":"EQUIP470/A41","ref_terminal_fournisseur":"4250000873","ref_terminal_tec":"270567043","lame_cuivre":{"reference":"3.5*2.2","quantity":"3"},"lame_isolant":{"reference":"2.6*2.6","quantity":"3"},"enclume_cuivre":{"reference":"3.7*2.2","quantity":"3"},"enclume_isolant":{"reference":"2.6*2.6","quantity":"3"},"lame_denudage_jeux":"3"}
279	PDR-EQUIP472_A42	WEIJONG/WJ-1800S / EQUIP472/A42	270621880 / 1735801-1	\N	Terminal fournisseur: 1735801-1 | Terminal TEC: 270621880 | Lame cuivre: 1.4*1.3 x 0 | Lame isolant: 1.5*1.5 x 2 | Enclume cuivre: 1.6*1.3 x 2 | Enclume isolant: 1.5*1.5 x 2 | Lame de denudage (jeux): 2	En service	2026-04-22 14:15:11.229+01	2026-04-22 14:15:11.229+01	8	64	pdr	{"ref_applicateur_tec":"EQUIP472/A42","ref_terminal_fournisseur":"1735801-1","ref_terminal_tec":"270621880","lame_cuivre":{"reference":"1.4*1.3","quantity":"0"},"lame_isolant":{"reference":"1.5*1.5","quantity":"2"},"enclume_cuivre":{"reference":"1.6*1.3","quantity":"2"},"enclume_isolant":{"reference":"1.5*1.5","quantity":"2"},"lame_denudage_jeux":"2"}
280	PDR-EQUIP468_A43	WEIJONG/ 3 T / EQUIP468/A43	270607660 / MEC7190766	\N	Terminal fournisseur: MEC7190766 | Terminal TEC: 270607660 | Lame cuivre: 4.0*2.4 x 3 | Lame isolant: 5.0*3.2 x 3 | Enclume cuivre: 4.8*2.4 x 3 | Enclume isolant: 5.0*3.2 x 3 | Lame de denudage (jeux): 1	En service	2026-04-22 14:15:11.232+01	2026-04-22 14:15:11.232+01	8	65	pdr	{"ref_applicateur_tec":"EQUIP468/A43","ref_terminal_fournisseur":"MEC7190766","ref_terminal_tec":"270607660","lame_cuivre":{"reference":"4.0*2.4","quantity":"3"},"lame_isolant":{"reference":"5.0*3.2","quantity":"3"},"enclume_cuivre":{"reference":"4.8*2.4","quantity":"3"},"enclume_isolant":{"reference":"5.0*3.2","quantity":"3"},"lame_denudage_jeux":"1"}
281	PDR-A44	WEIJONG/WJ-1800S / A44	270610170 / 1060-16-0622	\N	Terminal fournisseur: 1060-16-0622 | Terminal TEC: 270610170 | Lame cuivre: 2.4*2.4 x 2 | Lame isolant: 3.5*2.6R x 2 | Enclume cuivre: 2.6*2.4 x 2 | Enclume isolant: 3.5*2.6 x 2 | Lame de denudage (jeux): 2 | Complements: Fournisseur 1062-16-0622, TEC 270610160 / Fournisseur 1062-16-0644, TEC 270612620, Jeux 1	En service	2026-04-22 14:15:11.242+01	2026-04-22 14:15:11.242+01	8	64	pdr	{"ref_applicateur_tec":"A44","ref_terminal_fournisseur":"1060-16-0622","ref_terminal_tec":"270610170","lame_cuivre":{"reference":"2.4*2.4","quantity":"2"},"lame_isolant":{"reference":"3.5*2.6R","quantity":"2"},"enclume_cuivre":{"reference":"2.6*2.4","quantity":"2"},"enclume_isolant":{"reference":"3.5*2.6","quantity":"2"},"lame_denudage_jeux":"2"}
282	PDR-A01	LINTECH / A01	270567021 / 282403-1	\N	Terminal fournisseur: 282403-1 | Terminal TEC: 270567021 | Lame cuivre: 991460463 x 0 | Lame isolant: 991450300 F21 x 0 | Enclume cuivre: 991270248 C21 x 0 | Enclume isolant: 991270249 H21 x 0	En service	2026-04-22 14:15:11.246+01	2026-04-22 14:15:11.246+01	8	66	pdr	{"ref_applicateur_tec":"A01","ref_terminal_fournisseur":"282403-1","ref_terminal_tec":"270567021","lame_cuivre":{"reference":"991460463","quantity":"0"},"lame_isolant":{"reference":"991450300 F21","quantity":"0"},"enclume_cuivre":{"reference":"991270248 C21","quantity":"0"},"enclume_isolant":{"reference":"991270249 H21","quantity":"0"},"lame_denudage_jeux":null}
283	PDR-A01_1	MECAL / A01-1	270567011 / 282404_1	\N	Terminal fournisseur: 282404_1 | Terminal TEC: 270567011 | Lame cuivre: 991460463 x 0 | Lame isolant: 991450300 H22 x 1 | Enclume cuivre: 991270248 C21 x 1 | Enclume isolant: 991270249 H21 x 1	En service	2026-04-22 14:15:11.248+01	2026-04-22 14:15:11.248+01	8	11	pdr	{"ref_applicateur_tec":"A01-1","ref_terminal_fournisseur":"282404_1","ref_terminal_tec":"270567011","lame_cuivre":{"reference":"991460463","quantity":"0"},"lame_isolant":{"reference":"991450300 H22","quantity":"1"},"enclume_cuivre":{"reference":"991270248 C21","quantity":"1"},"enclume_isolant":{"reference":"991270249 H21","quantity":"1"},"lame_denudage_jeux":null}
284	PDR-A02	LINTECH / A02	923919100 / 282110_1	\N	Terminal fournisseur: 282110_1 | Terminal TEC: 923919100 | Lame cuivre: LPC00029 x 1 | Lame isolant: LPI00021 x 2 | Enclume cuivre: LEC00027 x 0 | Enclume isolant: LEI00021 x 0	En service	2026-04-22 14:15:11.253+01	2026-04-22 14:15:11.253+01	8	66	pdr	{"ref_applicateur_tec":"A02","ref_terminal_fournisseur":"282110_1","ref_terminal_tec":"923919100","lame_cuivre":{"reference":"LPC00029","quantity":"1"},"lame_isolant":{"reference":"LPI00021","quantity":"2"},"enclume_cuivre":{"reference":"LEC00027","quantity":"0"},"enclume_isolant":{"reference":"LEI00021","quantity":"0"},"lame_denudage_jeux":null}
285	PDR-A02_1	MECAL / A02-1	923921000 / 282109_1	\N	Terminal fournisseur: 282109_1 | Terminal TEC: 923921000 | Lame cuivre: 991460629 C22 x 1 | Lame isolant: 991450359 L21 x 1 | Enclume cuivre: 991270168 C21 x 1 | Enclume isolant: 991270249 H21 x 1	En service	2026-04-22 14:15:11.266+01	2026-04-22 14:15:11.266+01	8	11	pdr	{"ref_applicateur_tec":"A02-1","ref_terminal_fournisseur":"282109_1","ref_terminal_tec":"923921000","lame_cuivre":{"reference":"991460629 C22","quantity":"1"},"lame_isolant":{"reference":"991450359 L21","quantity":"1"},"enclume_cuivre":{"reference":"991270168 C21","quantity":"1"},"enclume_isolant":{"reference":"991270249 H21","quantity":"1"},"lame_denudage_jeux":null}
286	PDR-A03	LINTECH / A03	270567111 / SC16M_1S31	\N	Terminal fournisseur: SC16M_1S31 | Terminal TEC: 270567111 | Lame cuivre: LPC00033 x 1 | Lame isolant: - x 0 | Enclume cuivre: LEC00032 x 2 | Enclume isolant: - x 0 | Complements: Fournisseur SM16M_1S31, TEC 270567570	En service	2026-04-22 14:15:11.275+01	2026-04-22 14:15:11.275+01	8	66	pdr	{"ref_applicateur_tec":"A03","ref_terminal_fournisseur":"SC16M_1S31","ref_terminal_tec":"270567111","lame_cuivre":{"reference":"LPC00033","quantity":"1"},"lame_isolant":{"reference":null,"quantity":"0"},"enclume_cuivre":{"reference":"LEC00032","quantity":"2"},"enclume_isolant":{"reference":null,"quantity":"0"},"lame_denudage_jeux":null}
287	PDR-A04	MECAL / A04	270567570 / 926882_1	\N	Terminal fournisseur: 926882_1 | Terminal TEC: 270567570 | Lame cuivre: 991460108 x 0 | Lame isolant: 991450110 x 0 | Enclume cuivre: 991270034 x 0 | Enclume isolant: 991270035 x 0	En service	2026-04-22 14:15:11.278+01	2026-04-22 14:15:11.278+01	8	11	pdr	{"ref_applicateur_tec":"A04","ref_terminal_fournisseur":"926882_1","ref_terminal_tec":"270567570","lame_cuivre":{"reference":"991460108","quantity":"0"},"lame_isolant":{"reference":"991450110","quantity":"0"},"enclume_cuivre":{"reference":"991270034","quantity":"0"},"enclume_isolant":{"reference":"991270035","quantity":"0"},"lame_denudage_jeux":null}
288	PDR-A05	LINTECH / A05	923922200 / 08_70_1031	\N	Terminal fournisseur: 08_70_1031 | Terminal TEC: 923922200 | Lame cuivre: LPC00036 x 2 | Lame isolant: LPI00030 x 1 | Enclume cuivre: LEC00035 x 1 | Enclume isolant: LEI00029 x 1	En service	2026-04-22 14:15:11.28+01	2026-04-22 14:15:11.28+01	8	66	pdr	{"ref_applicateur_tec":"A05","ref_terminal_fournisseur":"08_70_1031","ref_terminal_tec":"923922200","lame_cuivre":{"reference":"LPC00036","quantity":"2"},"lame_isolant":{"reference":"LPI00030","quantity":"1"},"enclume_cuivre":{"reference":"LEC00035","quantity":"1"},"enclume_isolant":{"reference":"LEI00029","quantity":"1"},"lame_denudage_jeux":null}
289	PDR-A06	MECAL / A06	270554240 / 08_50_0031	\N	Terminal fournisseur: 08_50_0031 | Terminal TEC: 270554240 | Lame cuivre: 991460118 x 3 | Lame isolant: 991450112 x 2 | Enclume cuivre: 991273259 x 2 | Enclume isolant: 991270084 x 2	En service	2026-04-22 14:15:11.282+01	2026-04-22 14:15:11.282+01	8	11	pdr	{"ref_applicateur_tec":"A06","ref_terminal_fournisseur":"08_50_0031","ref_terminal_tec":"270554240","lame_cuivre":{"reference":"991460118","quantity":"3"},"lame_isolant":{"reference":"991450112","quantity":"2"},"enclume_cuivre":{"reference":"991273259","quantity":"2"},"enclume_isolant":{"reference":"991270084","quantity":"2"},"lame_denudage_jeux":null}
290	PDR-A07	MECAL / A07	##### / 68800113722	\N	Terminal fournisseur: 68800113722 | Terminal TEC: ##### | Lame cuivre: 991460349 x 1 | Lame isolant: 991450313 x 1 | Enclume cuivre: 991270545 x 0 | Enclume isolant: 991270546 x 1	En service	2026-04-22 14:15:11.287+01	2026-04-22 14:15:11.287+01	8	11	pdr	{"ref_applicateur_tec":"A07","ref_terminal_fournisseur":"68800113722","ref_terminal_tec":"#####","lame_cuivre":{"reference":"991460349","quantity":"1"},"lame_isolant":{"reference":"991450313","quantity":"1"},"enclume_cuivre":{"reference":"991270545","quantity":"0"},"enclume_isolant":{"reference":"991270546","quantity":"1"},"lame_denudage_jeux":null}
87	EQUIP365	Fer à souder	11.94	\N	Avec plomb	En service	2026-02-24 03:52:07.925+01	2026-04-24 14:24:25.791+01	4	32	equipement	\N
291	PDR-A08	MECAL / A08	270607530 / 39_00_0077	\N	Terminal fournisseur: 39_00_0077 | Terminal TEC: 270607530 | Lame cuivre: - x 0 | Lame isolant: - x 0 | Enclume cuivre: - x 0 | Enclume isolant: - x 0 | Complements: Fournisseur 39_00_0081, TEC 270607540	En service	2026-04-22 14:15:11.294+01	2026-04-22 14:15:11.294+01	8	11	pdr	{"ref_applicateur_tec":"A08","ref_terminal_fournisseur":"39_00_0077","ref_terminal_tec":"270607530","lame_cuivre":{"reference":null,"quantity":"0"},"lame_isolant":{"reference":null,"quantity":"0"},"enclume_cuivre":{"reference":null,"quantity":"0"},"enclume_isolant":{"reference":null,"quantity":"0"},"lame_denudage_jeux":null}
292	PDR-A09	MECATRACTION / A09	270607660 / MEC7190766	\N	Terminal fournisseur: MEC7190766 | Terminal TEC: 270607660 | Lame cuivre: 108967 x 0 | Lame isolant: 108970 x 0 | Enclume cuivre: 108968 x 0 | Enclume isolant: 108969 x 0	En service	2026-04-22 14:15:11.296+01	2026-04-22 14:15:11.296+01	8	67	pdr	{"ref_applicateur_tec":"A09","ref_terminal_fournisseur":"MEC7190766","ref_terminal_tec":"270607660","lame_cuivre":{"reference":"108967","quantity":"0"},"lame_isolant":{"reference":"108970","quantity":"0"},"enclume_cuivre":{"reference":"108968","quantity":"0"},"enclume_isolant":{"reference":"108969","quantity":"0"},"lame_denudage_jeux":null}
293	PDR-A10	MECAL / A10	270608760 / 1062_16_0122	\N	Terminal fournisseur: 1062_16_0122 | Terminal TEC: 270608760 | Lame cuivre: 991460302 x 2 | Lame isolant: 991450724 x 3 | Enclume cuivre: 991270113 x 2 | Enclume isolant: 991270114 x 2 | Complements: Fournisseur 1060_16_0122, TEC 270608560	En service	2026-04-22 14:15:11.298+01	2026-04-22 14:15:11.298+01	8	11	pdr	{"ref_applicateur_tec":"A10","ref_terminal_fournisseur":"1062_16_0122","ref_terminal_tec":"270608760","lame_cuivre":{"reference":"991460302","quantity":"2"},"lame_isolant":{"reference":"991450724","quantity":"3"},"enclume_cuivre":{"reference":"991270113","quantity":"2"},"enclume_isolant":{"reference":"991270114","quantity":"2"},"lame_denudage_jeux":null}
294	PDR-A11	MECAL / A11	270610410 / 1_66100_9	\N	Terminal fournisseur: 1_66100_9 | Terminal TEC: 270610410 | Lame cuivre: 991460254 x 7 | Lame isolant: 991450284 x 7 | Enclume cuivre: 991270208 x 2 | Enclume isolant: 991271203 x 2	En service	2026-04-22 14:15:11.301+01	2026-04-22 14:15:11.301+01	8	11	pdr	{"ref_applicateur_tec":"A11","ref_terminal_fournisseur":"1_66100_9","ref_terminal_tec":"270610410","lame_cuivre":{"reference":"991460254","quantity":"7"},"lame_isolant":{"reference":"991450284","quantity":"7"},"enclume_cuivre":{"reference":"991270208","quantity":"2"},"enclume_isolant":{"reference":"991271203","quantity":"2"},"lame_denudage_jeux":null}
295	PDR-A11_1	MECAL / A11_1	270610400 / 1_66098_8	\N	Terminal fournisseur: 1_66098_8 | Terminal TEC: 270610400	En service	2026-04-22 14:15:11.308+01	2026-04-22 14:15:11.308+01	8	11	pdr	{"ref_applicateur_tec":"A11_1","ref_terminal_fournisseur":"1_66098_8","ref_terminal_tec":"270610400","lame_cuivre":{"reference":null,"quantity":null},"lame_isolant":{"reference":null,"quantity":null},"enclume_cuivre":{"reference":null,"quantity":null},"enclume_isolant":{"reference":null,"quantity":null},"lame_denudage_jeux":null}
296	PDR-A12	MECAL / A12	270608830 / 1060_20_0222	\N	Terminal fournisseur: 1060_20_0222 | Terminal TEC: 270608830 | Lame cuivre: 991460142 x 2 | Lame isolant: 991450204 x 3 | Enclume cuivre: 991270192 x 2 | Enclume isolant: 991270193 x 2 | Complements: Fournisseur 1062_20_0223, TEC 270609950	En service	2026-04-22 14:15:11.31+01	2026-04-22 14:15:11.31+01	8	11	pdr	{"ref_applicateur_tec":"A12","ref_terminal_fournisseur":"1060_20_0222","ref_terminal_tec":"270608830","lame_cuivre":{"reference":"991460142","quantity":"2"},"lame_isolant":{"reference":"991450204","quantity":"3"},"enclume_cuivre":{"reference":"991270192","quantity":"2"},"enclume_isolant":{"reference":"991270193","quantity":"2"},"lame_denudage_jeux":null}
297	PDR-A13	MECAL / A13	270567042 / 4250000872	\N	Terminal fournisseur: 4250000872 | Terminal TEC: 270567042 | Lame cuivre: 991461439 x 1 | Lame isolant: 991450317 x 1 | Enclume cuivre: 991270030 x 1 | Enclume isolant: 991271137 x 1	En service	2026-04-22 14:15:11.314+01	2026-04-22 14:15:11.314+01	8	11	pdr	{"ref_applicateur_tec":"A13","ref_terminal_fournisseur":"4250000872","ref_terminal_tec":"270567042","lame_cuivre":{"reference":"991461439","quantity":"1"},"lame_isolant":{"reference":"991450317","quantity":"1"},"enclume_cuivre":{"reference":"991270030","quantity":"1"},"enclume_isolant":{"reference":"991271137","quantity":"1"},"lame_denudage_jeux":null}
298	PDR-A14	MECAL / A14	270608200 / 964269_2	\N	Terminal fournisseur: 964269_2 | Terminal TEC: 270608200 | Lame cuivre: 991460254 x 1 | Lame isolant: 991450449 x 1 | Enclume cuivre: 991270897 x 1 | Enclume isolant: 991270908 x 1	En service	2026-04-22 14:15:11.316+01	2026-04-22 14:15:11.316+01	8	11	pdr	{"ref_applicateur_tec":"A14","ref_terminal_fournisseur":"964269_2","ref_terminal_tec":"270608200","lame_cuivre":{"reference":"991460254","quantity":"1"},"lame_isolant":{"reference":"991450449","quantity":"1"},"enclume_cuivre":{"reference":"991270897","quantity":"1"},"enclume_isolant":{"reference":"991270908","quantity":"1"},"lame_denudage_jeux":null}
299	PDR-A15	MECAL / A15	270608260 / 1_968857_1	\N	Terminal fournisseur: 1_968857_1 | Terminal TEC: 270608260 | Lame cuivre: 991460795 x 1 | Lame isolant: 991452136 x 1 | Enclume cuivre: 991270697 x 1 | Enclume isolant: 991270197 x 1	En service	2026-04-22 14:15:11.325+01	2026-04-22 14:15:11.325+01	8	11	pdr	{"ref_applicateur_tec":"A15","ref_terminal_fournisseur":"1_968857_1","ref_terminal_tec":"270608260","lame_cuivre":{"reference":"991460795","quantity":"1"},"lame_isolant":{"reference":"991452136","quantity":"1"},"enclume_cuivre":{"reference":"991270697","quantity":"1"},"enclume_isolant":{"reference":"991270197","quantity":"1"},"lame_denudage_jeux":null}
300	PDR-A16	MECAL / A16	270608210 / 1_962916_1	\N	Terminal fournisseur: 1_962916_1 | Terminal TEC: 270608210 | Lame cuivre: 991460411 x 1 | Lame isolant: 991450484 x 1 | Enclume cuivre: 991270624 x 1 | Enclume isolant: 991270625 x 1	En service	2026-04-22 14:15:11.328+01	2026-04-22 14:15:11.328+01	8	11	pdr	{"ref_applicateur_tec":"A16","ref_terminal_fournisseur":"1_962916_1","ref_terminal_tec":"270608210","lame_cuivre":{"reference":"991460411","quantity":"1"},"lame_isolant":{"reference":"991450484","quantity":"1"},"enclume_cuivre":{"reference":"991270624","quantity":"1"},"enclume_isolant":{"reference":"991270625","quantity":"1"},"lame_denudage_jeux":null}
301	PDR-A17	MECAL / A17	270608000 / 1241380_1	\N	Terminal fournisseur: 1241380_1 | Terminal TEC: 270608000 | Lame cuivre: 991461508 x 1 | Lame isolant: 991452067 x 1 | Enclume cuivre: 991271422 x 1 | Enclume isolant: 991271419 x 1	En service	2026-04-22 14:15:11.331+01	2026-04-22 14:15:11.331+01	8	11	pdr	{"ref_applicateur_tec":"A17","ref_terminal_fournisseur":"1241380_1","ref_terminal_tec":"270608000","lame_cuivre":{"reference":"991461508","quantity":"1"},"lame_isolant":{"reference":"991452067","quantity":"1"},"enclume_cuivre":{"reference":"991271422","quantity":"1"},"enclume_isolant":{"reference":"991271419","quantity":"1"},"lame_denudage_jeux":null}
302	PDR-A18	MECAL / A18	270610160 / 1062_16_0622	\N	Terminal fournisseur: 1062_16_0622 | Terminal TEC: 270610160 | Lame cuivre: 991462356 x 1 | Lame isolant: 991450332 x 2 | Enclume cuivre: 991271947 x 1 | Enclume isolant: 991271512 x 1 | Complements: Fournisseur 1060_16_0622, TEC 2706610170	En service	2026-04-22 14:15:11.334+01	2026-04-22 14:15:11.334+01	8	11	pdr	{"ref_applicateur_tec":"A18","ref_terminal_fournisseur":"1062_16_0622","ref_terminal_tec":"270610160","lame_cuivre":{"reference":"991462356","quantity":"1"},"lame_isolant":{"reference":"991450332","quantity":"2"},"enclume_cuivre":{"reference":"991271947","quantity":"1"},"enclume_isolant":{"reference":"991271512","quantity":"1"},"lame_denudage_jeux":null}
303	PDR-A19	MECAL / A19	270611400 / SVF_61T_P2.0	\N	Terminal fournisseur: SVF_61T_P2.0 | Terminal TEC: 270611400 | Lame cuivre: 991460133 x 1 | Lame isolant: 991450965 x 1 | Enclume cuivre: 991273773 x 1 | Enclume isolant: 991272676 x 1	En service	2026-04-22 14:15:11.344+01	2026-04-22 14:15:11.344+01	8	11	pdr	{"ref_applicateur_tec":"A19","ref_terminal_fournisseur":"SVF_61T_P2.0","ref_terminal_tec":"270611400","lame_cuivre":{"reference":"991460133","quantity":"1"},"lame_isolant":{"reference":"991450965","quantity":"1"},"enclume_cuivre":{"reference":"991273773","quantity":"1"},"enclume_isolant":{"reference":"991272676","quantity":"1"},"lame_denudage_jeux":null}
304	PDR-A20	MECAL / A20	270611430 / SXH_001T_P0.6	\N	Terminal fournisseur: SXH_001T_P0.6 | Terminal TEC: 270611430 | Lame cuivre: 991460796 x 1 | Lame isolant: 991451815 x 1 | Enclume cuivre: 991271426 x 1 | Enclume isolant: 991274478 x 1	En service	2026-04-22 14:15:11.346+01	2026-04-22 14:15:11.346+01	8	11	pdr	{"ref_applicateur_tec":"A20","ref_terminal_fournisseur":"SXH_001T_P0.6","ref_terminal_tec":"270611430","lame_cuivre":{"reference":"991460796","quantity":"1"},"lame_isolant":{"reference":"991451815","quantity":"1"},"enclume_cuivre":{"reference":"991271426","quantity":"1"},"enclume_isolant":{"reference":"991274478","quantity":"1"},"lame_denudage_jeux":null}
305	PDR-A21	MECAL / A21	270611340 / SVF_81T_P2.0	\N	Terminal fournisseur: SVF_81T_P2.0 | Terminal TEC: 270611340 | Lame cuivre: 991460829 x 1 | Lame isolant: 991450158 x 1 | Enclume cuivre: 991270347 x 1 | Enclume isolant: 991273413 x 1	En service	2026-04-22 14:15:11.348+01	2026-04-22 14:15:11.348+01	8	11	pdr	{"ref_applicateur_tec":"A21","ref_terminal_fournisseur":"SVF_81T_P2.0","ref_terminal_tec":"270611340","lame_cuivre":{"reference":"991460829","quantity":"1"},"lame_isolant":{"reference":"991450158","quantity":"1"},"enclume_cuivre":{"reference":"991270347","quantity":"1"},"enclume_isolant":{"reference":"991273413","quantity":"1"},"lame_denudage_jeux":null}
306	PDR-A22	MECAL / A22	270600650 / 770520_1	\N	Terminal fournisseur: 770520_1 | Terminal TEC: 270600650 | Lame cuivre: 991460623 x 1 | Lame isolant: 991450620 x 1 | Enclume cuivre: 991273114 x 1 | Enclume isolant: 991270185 x 1 | Complements: Fournisseur 770520_3, TEC 270612540	En service	2026-04-22 14:15:11.35+01	2026-04-22 14:15:11.35+01	8	11	pdr	{"ref_applicateur_tec":"A22","ref_terminal_fournisseur":"770520_1","ref_terminal_tec":"270600650","lame_cuivre":{"reference":"991460623","quantity":"1"},"lame_isolant":{"reference":"991450620","quantity":"1"},"enclume_cuivre":{"reference":"991273114","quantity":"1"},"enclume_isolant":{"reference":"991270185","quantity":"1"},"lame_denudage_jeux":null}
307	PDR-A23	MECAL / A23	270612730 / 929939_1	\N	Terminal fournisseur: 929939_1 | Terminal TEC: 270612730 | Lame cuivre: 991460254 x 1 | Lame isolant: 991450411 x 1 | Enclume cuivre: 991270240 x 1 | Enclume isolant: 991270705 x 1	En service	2026-04-22 14:15:11.356+01	2026-04-22 14:15:11.356+01	8	11	pdr	{"ref_applicateur_tec":"A23","ref_terminal_fournisseur":"929939_1","ref_terminal_tec":"270612730","lame_cuivre":{"reference":"991460254","quantity":"1"},"lame_isolant":{"reference":"991450411","quantity":"1"},"enclume_cuivre":{"reference":"991270240","quantity":"1"},"enclume_isolant":{"reference":"991270705","quantity":"1"},"lame_denudage_jeux":null}
308	PDR-A24	MECAL / A24	270620980 / 7_1452668_3	\N	Terminal fournisseur: 7_1452668_3 | Terminal TEC: 270620980 | Lame cuivre: 991461599 x 1 | Lame isolant: 991451106 x 1 | Enclume cuivre: 991272421 x 1 | Enclume isolant: 991270055 x 1	En service	2026-04-22 14:15:11.361+01	2026-04-22 14:15:11.361+01	8	11	pdr	{"ref_applicateur_tec":"A24","ref_terminal_fournisseur":"7_1452668_3","ref_terminal_tec":"270620980","lame_cuivre":{"reference":"991461599","quantity":"1"},"lame_isolant":{"reference":"991451106","quantity":"1"},"enclume_cuivre":{"reference":"991272421","quantity":"1"},"enclume_isolant":{"reference":"991270055","quantity":"1"},"lame_denudage_jeux":null}
309	PDR-A25	KRISTEN / A25	270614380 / 15363934	\N	Terminal fournisseur: 15363934 | Terminal TEC: 270614380 | Lame cuivre: PB Constructeur x 0 | Lame isolant: - x 0 | Enclume cuivre: - x 0 | Enclume isolant: - x 0	En service	2026-04-22 14:15:11.363+01	2026-04-22 14:15:11.363+01	8	68	pdr	{"ref_applicateur_tec":"A25","ref_terminal_fournisseur":"15363934","ref_terminal_tec":"270614380","lame_cuivre":{"reference":"PB Constructeur","quantity":"0"},"lame_isolant":{"reference":null,"quantity":"0"},"enclume_cuivre":{"reference":null,"quantity":"0"},"enclume_isolant":{"reference":null,"quantity":"0"},"lame_denudage_jeux":null}
310	PDR-A26	KRISTEN / A26	270600550 / 12089188	\N	Terminal fournisseur: 12089188 | Terminal TEC: 270600550 | Lame cuivre: PB Constructeur x 0 | Lame isolant: - x 0 | Enclume cuivre: - x 0 | Enclume isolant: - x 0 | Complements: Fournisseur 12089040, TEC 270600460 / Fournisseur 15344720	En service	2026-04-22 14:15:11.365+01	2026-04-22 14:15:11.365+01	8	68	pdr	{"ref_applicateur_tec":"A26","ref_terminal_fournisseur":"12089188","ref_terminal_tec":"270600550","lame_cuivre":{"reference":"PB Constructeur","quantity":"0"},"lame_isolant":{"reference":null,"quantity":"0"},"enclume_cuivre":{"reference":null,"quantity":"0"},"enclume_isolant":{"reference":null,"quantity":"0"},"lame_denudage_jeux":null}
311	PDR-A27	SIROCCO / A27	270615860 / M34S75C4F2	\N	Terminal fournisseur: M34S75C4F2 | Terminal TEC: 270615860 | Lame cuivre: 3721538031 x 4 | Lame isolant: 3721538051 x 3 | Enclume cuivre: 3721538201 x 2 | Enclume isolant: 3721538211 x 2	En service	2026-04-22 14:15:11.37+01	2026-04-22 14:15:11.37+01	8	69	pdr	{"ref_applicateur_tec":"A27","ref_terminal_fournisseur":"M34S75C4F2","ref_terminal_tec":"270615860","lame_cuivre":{"reference":"3721538031","quantity":"4"},"lame_isolant":{"reference":"3721538051","quantity":"3"},"enclume_cuivre":{"reference":"3721538201","quantity":"2"},"enclume_isolant":{"reference":"3721538211","quantity":"2"},"lame_denudage_jeux":null}
312	PDR-A28	MECAL / A28	270609780 / 1703013_1	\N	Terminal fournisseur: 1703013_1 | Terminal TEC: 270609780 | Lame cuivre: 991460254 x 1 | Lame isolant: 991450936 x 1 | Enclume cuivre: 991270258 x 1 | Enclume isolant: 991270159 x 1 | Complements: Fournisseur 929989_1, TEC 270609770	En service	2026-04-22 14:15:11.377+01	2026-04-22 14:15:11.377+01	8	11	pdr	{"ref_applicateur_tec":"A28","ref_terminal_fournisseur":"1703013_1","ref_terminal_tec":"270609780","lame_cuivre":{"reference":"991460254","quantity":"1"},"lame_isolant":{"reference":"991450936","quantity":"1"},"enclume_cuivre":{"reference":"991270258","quantity":"1"},"enclume_isolant":{"reference":"991270159","quantity":"1"},"lame_denudage_jeux":null}
313	PDR-A29	MECAL / A29	270567043 / 4250000873	\N	Terminal fournisseur: 4250000873 | Terminal TEC: 270567043 | Lame cuivre: 99146025 x 1 | Lame isolant: 991450466 x 1 | Enclume cuivre: 991271042 x 1 | Enclume isolant: 991270209 x 1	En service	2026-04-22 14:15:11.381+01	2026-04-22 14:15:11.381+01	8	11	pdr	{"ref_applicateur_tec":"A29","ref_terminal_fournisseur":"4250000873","ref_terminal_tec":"270567043","lame_cuivre":{"reference":"99146025","quantity":"1"},"lame_isolant":{"reference":"991450466","quantity":"1"},"enclume_cuivre":{"reference":"991271042","quantity":"1"},"enclume_isolant":{"reference":"991270209","quantity":"1"},"lame_denudage_jeux":null}
314	PDR-A30	MECAL / A30	270610660 / 1060_16_1222	\N	Terminal fournisseur: 1060_16_1222 | Terminal TEC: 270610660 | Lame cuivre: 991460149 x 1 | Lame isolant: 991450449 x 1 | Enclume cuivre: 991270499 x 1 | Enclume isolant: 991270500 x 1 | Complements: Fournisseur 1062_16_1223, TEC 270610680	En service	2026-04-22 14:15:11.384+01	2026-04-22 14:15:11.384+01	8	11	pdr	{"ref_applicateur_tec":"A30","ref_terminal_fournisseur":"1060_16_1222","ref_terminal_tec":"270610660","lame_cuivre":{"reference":"991460149","quantity":"1"},"lame_isolant":{"reference":"991450449","quantity":"1"},"enclume_cuivre":{"reference":"991270499","quantity":"1"},"enclume_isolant":{"reference":"991270500","quantity":"1"},"lame_denudage_jeux":null}
315	PDR-A31	MECAL / A31	270621880 / 1735801_1	\N	Terminal fournisseur: 1735801_1 | Terminal TEC: 270621880 | Lame cuivre: 991460349 x 1 | Lame isolant: 1450372 x 3 | Enclume cuivre: 991270545 x 2 | Enclume isolant: 991272495 x 3	En service	2026-04-22 14:15:11.388+01	2026-04-22 14:15:11.388+01	8	11	pdr	{"ref_applicateur_tec":"A31","ref_terminal_fournisseur":"1735801_1","ref_terminal_tec":"270621880","lame_cuivre":{"reference":"991460349","quantity":"1"},"lame_isolant":{"reference":"1450372","quantity":"3"},"enclume_cuivre":{"reference":"991270545","quantity":"2"},"enclume_isolant":{"reference":"991272495","quantity":"3"},"lame_denudage_jeux":null}
316	PDR-A32	MECAL / A32	270612020 / SO20M2F	\N	Terminal fournisseur: SO20M2F | Terminal TEC: 270612020 | Lame cuivre: 991462633 x 1 | Lame isolant: 991451707 x 1 | Enclume cuivre: 991270257 x 1 | Enclume isolant: 991270258 x 1	En service	2026-04-22 14:15:11.393+01	2026-04-22 14:15:11.393+01	8	11	pdr	{"ref_applicateur_tec":"A32","ref_terminal_fournisseur":"SO20M2F","ref_terminal_tec":"270612020","lame_cuivre":{"reference":"991462633","quantity":"1"},"lame_isolant":{"reference":"991451707","quantity":"1"},"enclume_cuivre":{"reference":"991270257","quantity":"1"},"enclume_isolant":{"reference":"991270258","quantity":"1"},"lame_denudage_jeux":null}
317	PDR-A33	MECAL / A33	270612030 / SO20M1F	\N	Terminal fournisseur: SO20M1F | Terminal TEC: 270612030 | Lame cuivre: 991460226 x 1 | Lame isolant: 991450207 x 1 | Enclume cuivre: 991270307 x 1 | Enclume isolant: 991270308 x 1	En service	2026-04-22 14:15:11.395+01	2026-04-22 14:15:11.395+01	8	11	pdr	{"ref_applicateur_tec":"A33","ref_terminal_fournisseur":"SO20M1F","ref_terminal_tec":"270612030","lame_cuivre":{"reference":"991460226","quantity":"1"},"lame_isolant":{"reference":"991450207","quantity":"1"},"enclume_cuivre":{"reference":"991270307","quantity":"1"},"enclume_isolant":{"reference":"991270308","quantity":"1"},"lame_denudage_jeux":null}
318	PDR-A34	MECAL / A34	270613280 / 3_1447221_4	\N	Terminal fournisseur: 3_1447221_4 | Terminal TEC: 270613280 | Lame cuivre: 991460818 x 1 | Lame isolant: 991450910 x 1 | Enclume cuivre: 991270834 x 1 | Enclume isolant: 991270332 x 1	En service	2026-04-22 14:15:11.397+01	2026-04-22 14:15:11.397+01	8	11	pdr	{"ref_applicateur_tec":"A34","ref_terminal_fournisseur":"3_1447221_4","ref_terminal_tec":"270613280","lame_cuivre":{"reference":"991460818","quantity":"1"},"lame_isolant":{"reference":"991450910","quantity":"1"},"enclume_cuivre":{"reference":"991270834","quantity":"1"},"enclume_isolant":{"reference":"991270332","quantity":"1"},"lame_denudage_jeux":null}
319	PDR-A35	MECAL / A35	270613320 / 3_1447221_3	\N	Terminal fournisseur: 3_1447221_3 | Terminal TEC: 270613320 | Lame cuivre: 991460476 x 1 | Lame isolant: 991450910 x 1 | Enclume cuivre: 991270331 x 1 | Enclume isolant: 991270332 x 1	En service	2026-04-22 14:15:11.399+01	2026-04-22 14:15:11.399+01	8	11	pdr	{"ref_applicateur_tec":"A35","ref_terminal_fournisseur":"3_1447221_3","ref_terminal_tec":"270613320","lame_cuivre":{"reference":"991460476","quantity":"1"},"lame_isolant":{"reference":"991450910","quantity":"1"},"enclume_cuivre":{"reference":"991270331","quantity":"1"},"enclume_isolant":{"reference":"991270332","quantity":"1"},"lame_denudage_jeux":null}
320	PDR-A36	MECATRACTION / A36	270621840 / 00434_8DP	\N	Terminal fournisseur: 00434_8DP | Terminal TEC: 270621840 | Lame cuivre: 5131239 x 1 | Lame isolant: 2350320 x 1 | Enclume cuivre: 5151121 x 1 | Enclume isolant: 5151392 x 1	En service	2026-04-22 14:15:11.404+01	2026-04-22 14:15:11.404+01	8	67	pdr	{"ref_applicateur_tec":"A36","ref_terminal_fournisseur":"00434_8DP","ref_terminal_tec":"270621840","lame_cuivre":{"reference":"5131239","quantity":"1"},"lame_isolant":{"reference":"2350320","quantity":"1"},"enclume_cuivre":{"reference":"5151121","quantity":"1"},"enclume_isolant":{"reference":"5151392","quantity":"1"},"lame_denudage_jeux":null}
321	PDR-A37	MECATRACTION / A37	270621840 / 00405_8DP	\N	Terminal fournisseur: 00405_8DP | Terminal TEC: 270621840 | Lame cuivre: 107303 x 1 | Lame isolant: 18976 x 1 | Enclume cuivre: 107304 x 1 | Enclume isolant: 107305 x 1	En service	2026-04-22 14:15:11.408+01	2026-04-22 14:15:11.408+01	8	67	pdr	{"ref_applicateur_tec":"A37","ref_terminal_fournisseur":"00405_8DP","ref_terminal_tec":"270621840","lame_cuivre":{"reference":"107303","quantity":"1"},"lame_isolant":{"reference":"18976","quantity":"1"},"enclume_cuivre":{"reference":"107304","quantity":"1"},"enclume_isolant":{"reference":"107305","quantity":"1"},"lame_denudage_jeux":null}
322	PDR-A45	MECAL / A45	270624420 / 43030_0001	\N	Terminal fournisseur: 43030_0001 | Terminal TEC: 270624420 | Lame cuivre: 991460118 x 1 | Lame isolant: 991450895 x 1 | Enclume cuivre: 991270119 x 1 | Enclume isolant: 991270232 x 1 | Complements: Fournisseur 43031_0001, TEC 270624410	En service	2026-04-22 14:15:11.41+01	2026-04-22 14:15:11.41+01	8	11	pdr	{"ref_applicateur_tec":"A45","ref_terminal_fournisseur":"43030_0001","ref_terminal_tec":"270624420","lame_cuivre":{"reference":"991460118","quantity":"1"},"lame_isolant":{"reference":"991450895","quantity":"1"},"enclume_cuivre":{"reference":"991270119","quantity":"1"},"enclume_isolant":{"reference":"991270232","quantity":"1"},"lame_denudage_jeux":null}
\.


--
-- TOC entry 5693 (class 0 OID 24699)
-- Dependencies: 244
-- Data for Name: fabricants; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.fabricants (id, nom, pays, contact) FROM stdin;
1	METEOR	\N	\N
2	OUTELEM	\N	\N
3	RADIO CONTRÔLE	\N	\N
4	Schleuniger	\N	\N
5	Printing International	\N	\N
6	Wirelease	\N	\N
7	Komax	\N	\N
8	ARC	\N	\N
9	Kirsten	\N	\N
10	MEGOMAT	\N	\N
11	MECAL	\N	\N
12	GLW	\N	\N
13	BRANSON	\N	\N
14	A R O	\N	\N
15	RAPID AIR	\N	\N
16	ENERDIS	\N	\N
17	Atomateur	\N	\N
18	BRISTOL	\N	\N
19	ARMECA	\N	\N
20	Ultrasonic	\N	\N
21	LBJ	\N	\N
22	EMG	\N	\N
23	HYDROMA	\N	\N
24	ORNANS	\N	\N
25	Kraft paket	\N	\N
26	PARKER	\N	\N
27	BURGER	\N	\N
28	PRESSOTECHNIK	\N	\N
29	ERSA	\N	\N
30	HAKO	\N	\N
31	Loupot S.A	\N	\N
32	WELLER	\N	\N
33	Mecasonic	\N	\N
34	Festo pneumatique	\N	\N
35	Chinois	\N	\N
36	SOURIAU	\N	\N
37	DMC	\N	\N
38	TYCO	\N	\N
39	DEUTSCH	\N	\N
40	DELPHI	\N	\N
41	KNIPEX	\N	\N
42	WEIDMULLER	\N	\N
43	weidmuller	\N	\N
44	Inconnu	\N	\N
45	MOLEX	\N	\N
46	JST	\N	\N
47	CINCH	\N	\N
48	BINDER	\N	\N
49	RADIOSPARE	\N	\N
50	AMPHENOL	\N	\N
51	FCI	\N	\N
52	ITT CANNON	\N	\N
53	FCI AMPHENOL	\N	\N
54	Amphenol	\N	\N
55		\N	\N
56	molex	\N	\N
57	INCONNU	\N	\N
64	WEIJONG/WJ-1800S	\N	\N
65	WEIJONG/ 3 T	\N	\N
66	LINTECH	\N	\N
67	MECATRACTION	\N	\N
68	KRISTEN	\N	\N
69	SIROCCO	\N	\N
70	Fabricant Test UI 2026	\N	\N
71	Fabricant Test UI A	\N	\N
72	Fabricant Test UI B	\N	\N
\.


--
-- TOC entry 5695 (class 0 OID 24703)
-- Dependencies: 246
-- Data for Name: maintenance_events; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.maintenance_events (id, equip_code, interval_type, week, year, status, new_week, "createdAt", "updatedAt") FROM stdin;
1	EQUIP85	1M	1	2026	done	\N	2026-02-25 05:20:23.454+01	2026-02-25 05:20:23.454+01
2	EQUIP194	1M	8	2026	done	\N	2026-02-25 05:20:36.606+01	2026-02-25 05:20:36.606+01
3	EQUIP405	1M	5	2026	done	\N	2026-02-25 05:21:43.656+01	2026-02-25 05:21:43.656+01
4	EQUIP85	1M	5	2026	done	\N	2026-02-25 05:21:45.529+01	2026-02-25 05:21:45.529+01
5	EQUIP349	1M	9	2026	done	\N	2026-02-25 05:33:18.408+01	2026-02-25 05:33:18.408+01
6	EQUIP476	1M	9	2026	done	\N	2026-02-25 05:33:19.508+01	2026-02-25 05:33:19.508+01
7	EQUIP444	1M	9	2026	done	\N	2026-02-25 05:33:20.518+01	2026-02-25 05:33:20.518+01
8	EQUIP65	1M	9	2026	done	\N	2026-02-25 05:33:25.886+01	2026-02-25 05:33:25.886+01
9	EQUIP384	1M	9	2026	done	\N	2026-02-25 05:33:27.101+01	2026-02-25 05:33:27.101+01
10	EQUIP459	1M	9	2026	done	\N	2026-02-25 05:33:28.281+01	2026-02-25 05:33:28.281+01
11	EQUIP85	1M	9	2026	done	\N	2026-02-25 05:33:30.077+01	2026-02-25 05:33:30.077+01
12	EQUIP349	1M	5	2026	done	\N	2026-02-25 05:36:59.807+01	2026-02-25 05:36:59.807+01
13	EQUIP347	1M	14	2026	done	\N	2026-04-02 05:55:32.138+01	2026-04-02 05:55:32.138+01
14	EQUIP451	1M	14	2026	done	\N	2026-04-02 05:55:41.635+01	2026-04-02 05:55:41.635+01
15	EQUIP75	1M	14	2026	done	\N	2026-04-02 14:48:44.623+01	2026-04-02 14:48:44.623+01
\.


--
-- TOC entry 5706 (class 0 OID 41572)
-- Dependencies: 257
-- Data for Name: maintenance_sheets; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.maintenance_sheets (id, machine_key, machine_label, reference, template, tasks, spare_parts, observations, operator_matricule, operator_signature, started_at, finished_at, status, "createdAt", "updatedAt") FROM stdin;
1	sertissage	Machine de sertissage	\N	{"sections": [{"key": "monthly", "tasks": [{"label": "Verifier le systeme de securite de la machine (Arret d'urgence, capot de securite, marche-Arret...)", "number": 1, "criterion": "Marche et arret"}, {"label": "Verifier le manometre de pression et les pieces pneumatique", "number": 2, "criterion": "En bonne etat"}, {"label": "Verifier l'etat des machoires", "number": 3, "criterion": "En bonne etat"}, {"label": "Verifier l'etat des couteaux", "number": 4, "criterion": "Pas d'usure"}, {"label": "Verifier l'etat des capteurs et leur bon fonctionnement", "number": 5, "criterion": "En bonne etat"}, {"label": "Verifier l'etat du module de denudage", "number": 6, "criterion": "Bonne etat / propre"}, {"label": "Nettoyer l'interieure de la machine avec un aspirateur", "number": 7, "criterion": "Utiliser un aspirateur"}, {"label": "Verifier le poincons et les griffes de serrage de basse outil", "number": 8, "criterion": "Usees"}], "title": "Maintenance preventive systematique mensuelle"}, {"key": "semiannual", "tasks": [{"label": "Verifier generale sur la machine", "number": 9, "criterion": "Pas d'endommagement"}, {"label": "Verifier les parametres", "number": 10, "criterion": "OK"}, {"label": "Verifier l'etat de moteur et leur systeme de refroidissement", "number": 11, "criterion": "Pas de coincement"}, {"label": "Verifier la coffre electrique de la machine", "number": 12, "criterion": "Pas d'usure"}, {"label": "Nettoyer et graisser la cremaliere et les pignon du presse", "number": 13, "criterion": "En bonne etat"}], "title": "Maintenance preventive systematique semestrielle"}], "subtitle": "Plan de maintenance preventive systematique", "machineKey": "sertissage", "machineLabel": "Machine de sertissage"}	[{"note": "", "label": "Verifier le systeme de securite de la machine (Arret d'urgence, capot de securite, marche-Arret...)", "number": 1, "status": "ok", "criterion": "Marche et arret", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier le manometre de pression et les pieces pneumatique", "number": 2, "status": "ok", "criterion": "En bonne etat", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier l'etat des machoires", "number": 3, "status": "ok", "criterion": "En bonne etat", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier l'etat des couteaux", "number": 4, "status": "ok", "criterion": "Pas d'usure", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier l'etat des capteurs et leur bon fonctionnement", "number": 5, "status": "ok", "criterion": "En bonne etat", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier l'etat du module de denudage", "number": 6, "status": "ok", "criterion": "Bonne etat / propre", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Nettoyer l'interieure de la machine avec un aspirateur", "number": 7, "status": "ok", "criterion": "Utiliser un aspirateur", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier le poincons et les griffes de serrage de basse outil", "number": 8, "status": "ok", "criterion": "Usees", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier generale sur la machine", "number": 9, "status": "ok", "criterion": "Pas d'endommagement", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Verifier les parametres", "number": 10, "status": "ok", "criterion": "OK", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Verifier l'etat de moteur et leur systeme de refroidissement", "number": 11, "status": "ok", "criterion": "Pas de coincement", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Verifier la coffre electrique de la machine", "number": 12, "status": "ok", "criterion": "Pas d'usure", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Nettoyer et graisser la cremaliere et les pignon du presse", "number": 13, "status": "ok", "criterion": "En bonne etat", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}]	[{"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}]	\N	\N	\N	2026-04-15 08:28:00.227+01	2026-04-15 08:28:46.324+01	completed	2026-04-15 08:28:00.248+01	2026-04-15 08:28:46.327+01
2	soudure	Machine de Soudure	\N	{"sections": [{"key": "monthly", "tasks": [{"label": "Verifier le systeme de securite de la machine (Arret d'urgence, marche-Arret...)", "number": 1, "criterion": "OK"}, {"label": "Nettoyage generale de la machine", "number": 2, "criterion": "OK"}, {"label": "Verifier les electrodes du soudure", "number": 4, "criterion": "En bonne etat"}, {"label": "Verifier les systeme de refroidissement", "number": 5, "criterion": "En bonne etat"}], "title": "Maintenance preventive systematique mensuelle"}, {"key": "semiannual", "tasks": [{"label": "Changer si necessaire le reservoir et Verifier la circuit d'eau", "number": 7, "criterion": "controle / change"}, {"label": "Verification du sonde et de la pompe", "number": 8, "criterion": "controle"}, {"label": "Verifier la circuit pneumatique", "number": 9, "criterion": "controle"}, {"label": "Verifier la coffree et l'installation electrique de la machine", "number": 10, "criterion": "controle"}], "title": "Maintenance preventive systematique semestrielle"}], "subtitle": "Plan de maintenance preventive systematique", "machineKey": "soudure", "machineLabel": "Machine de Soudure"}	[{"note": "", "label": "Verifier le systeme de securite de la machine (Arret d'urgence, marche-Arret...)", "number": 1, "status": "", "criterion": "OK", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Nettoyage generale de la machine", "number": 2, "status": "", "criterion": "OK", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier les electrodes du soudure", "number": 4, "status": "", "criterion": "En bonne etat", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier les systeme de refroidissement", "number": 5, "status": "", "criterion": "En bonne etat", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Changer si necessaire le reservoir et Verifier la circuit d'eau", "number": 7, "status": "", "criterion": "controle / change", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Verification du sonde et de la pompe", "number": 8, "status": "", "criterion": "controle", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Verifier la circuit pneumatique", "number": 9, "status": "", "criterion": "controle", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Verifier la coffree et l'installation electrique de la machine", "number": 10, "status": "", "criterion": "controle", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}]	[{"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}]	\N	\N	\N	2026-04-24 12:04:39.372+01	2026-04-24 12:04:45.484+01	completed	2026-04-24 12:04:39.399+01	2026-04-24 12:04:45.489+01
3	sertissage	EQUIP061	\N	{"sections": [{"key": "monthly", "tasks": [{"label": "Verifier le systeme de securite de la machine (Arret d'urgence, capot de securite, marche-Arret...)", "number": 1, "criterion": "Marche et arret"}, {"label": "Verifier le manometre de pression et les pieces pneumatique", "number": 2, "criterion": "En bonne etat"}, {"label": "Verifier l'etat des machoires", "number": 3, "criterion": "En bonne etat"}, {"label": "Verifier l'etat des couteaux", "number": 4, "criterion": "Pas d'usure"}, {"label": "Verifier l'etat des capteurs et leur bon fonctionnement", "number": 5, "criterion": "En bonne etat"}, {"label": "Verifier l'etat du module de denudage", "number": 6, "criterion": "Bonne etat / propre"}, {"label": "Nettoyer l'interieure de la machine avec un aspirateur", "number": 7, "criterion": "Utiliser un aspirateur"}, {"label": "Verifier le poincons et les griffes de serrage de basse outil", "number": 8, "criterion": "Usees"}], "title": "Maintenance preventive systematique mensuelle"}, {"key": "semiannual", "tasks": [{"label": "Verifier generale sur la machine", "number": 9, "criterion": "Pas d'endommagement"}, {"label": "Verifier les parametres", "number": 10, "criterion": "OK"}, {"label": "Verifier l'etat de moteur et leur systeme de refroidissement", "number": 11, "criterion": "Pas de coincement"}, {"label": "Verifier la coffre electrique de la machine", "number": 12, "criterion": "Pas d'usure"}, {"label": "Nettoyer et graisser la cremaliere et les pignon du presse", "number": 13, "criterion": "En bonne etat"}], "title": "Maintenance preventive systematique semestrielle"}], "subtitle": "Plan de maintenance preventive systematique", "machineKey": "sertissage", "machineLabel": "Machine de sertissage"}	[{"note": "", "label": "Verifier le systeme de securite de la machine (Arret d'urgence, capot de securite, marche-Arret...)", "number": 1, "status": "ok", "criterion": "Marche et arret", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier le manometre de pression et les pieces pneumatique", "number": 2, "status": "ok", "criterion": "En bonne etat", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier l'etat des machoires", "number": 3, "status": "ok", "criterion": "En bonne etat", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier l'etat des couteaux", "number": 4, "status": "ok", "criterion": "Pas d'usure", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier l'etat des capteurs et leur bon fonctionnement", "number": 5, "status": "ok", "criterion": "En bonne etat", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier l'etat du module de denudage", "number": 6, "status": "ok", "criterion": "Bonne etat / propre", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Nettoyer l'interieure de la machine avec un aspirateur", "number": 7, "status": "ok", "criterion": "Utiliser un aspirateur", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier le poincons et les griffes de serrage de basse outil", "number": 8, "status": "ok", "criterion": "Usees", "sectionKey": "monthly", "sectionTitle": "Maintenance preventive systematique mensuelle"}, {"note": "", "label": "Verifier generale sur la machine", "number": 9, "status": "ok", "criterion": "Pas d'endommagement", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Verifier les parametres", "number": 10, "status": "ok", "criterion": "OK", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Verifier l'etat de moteur et leur systeme de refroidissement", "number": 11, "status": "ok", "criterion": "Pas de coincement", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Verifier la coffre electrique de la machine", "number": 12, "status": "ok", "criterion": "Pas d'usure", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}, {"note": "", "label": "Nettoyer et graisser la cremaliere et les pignon du presse", "number": 13, "status": "ok", "criterion": "En bonne etat", "sectionKey": "semiannual", "sectionTitle": "Maintenance preventive systematique semestrielle"}]	[{"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}, {"quantity": "", "reference": "", "designation": ""}]	\N	\N	\N	2026-04-24 13:56:52.495+01	2026-04-24 13:57:01.55+01	completed	2026-04-24 13:56:52.501+01	2026-04-24 13:57:01.557+01
\.


--
-- TOC entry 5697 (class 0 OID 24707)
-- Dependencies: 248
-- Data for Name: pince_maintenance_records; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.pince_maintenance_records (id, date_verification, test_value_1, test_value_2, test_value_3, test_value_4, test_value_5, statut_verification, remarque, "createdAt", "updatedAt", pince_variant_id) FROM stdin;
1	2025-05-05	106.00	103.00	145.00	120.00	115.00	À reprendre	\N	2026-04-22 14:10:53.853+01	2026-04-22 14:10:53.853+01	10
2	2025-05-05	144.00	135.00	120.00	162.00	156.00	À reprendre	\N	2026-04-22 14:10:53.857+01	2026-04-22 14:10:53.857+01	11
3	2025-05-05	125.00	122.00	132.00	133.00	142.00	À reprendre	\N	2026-04-22 14:10:53.86+01	2026-04-22 14:10:53.86+01	12
4	2025-05-05	85.00	73.00	80.00	90.00	79.00	À reprendre	\N	2026-04-22 14:10:53.868+01	2026-04-22 14:10:53.868+01	20
5	2025-05-05	105.00	112.00	126.00	122.00	99.00	À reprendre	\N	2026-04-22 14:10:53.884+01	2026-04-22 14:10:53.884+01	31
6	2025-05-05	171.00	167.00	166.00	174.00	179.00	À reprendre	\N	2026-04-22 14:10:53.887+01	2026-04-22 14:10:53.887+01	32
7	2025-05-05	107.00	78.00	98.00	107.00	95.00	À reprendre	\N	2026-04-22 14:10:53.913+01	2026-04-22 14:10:53.913+01	48
8	2025-05-05	123.00	115.00	187.00	194.00	193.00	À reprendre	\N	2026-04-22 14:10:53.919+01	2026-04-22 14:10:53.919+01	51
9	2025-05-05	167.00	171.00	159.00	168.00	177.00	À reprendre	\N	2026-04-22 14:10:53.926+01	2026-04-22 14:10:53.926+01	53
10	2025-05-05	183.00	175.00	181.00	192.00	136.00	À reprendre	\N	2026-04-22 14:10:53.928+01	2026-04-22 14:10:53.928+01	54
11	2025-05-05	133.00	113.00	120.00	117.00	143.00	À reprendre	\N	2026-04-22 14:10:53.929+01	2026-04-22 14:10:53.929+01	55
12	2025-05-05	102.00	91.00	88.00	138.00	99.00	À reprendre	\N	2026-04-22 14:10:53.931+01	2026-04-22 14:10:53.931+01	56
13	2025-05-05	317.00	327.00	320.00	315.00	328.00	À reprendre	\N	2026-04-22 14:10:53.937+01	2026-04-22 14:10:53.937+01	61
14	2025-05-05	319.00	324.00	320.00	331.00	316.00	À reprendre	\N	2026-04-22 14:10:53.939+01	2026-04-22 14:10:53.939+01	62
15	2025-05-05	86.00	95.00	84.00	80.00	79.00	À reprendre	\N	2026-04-22 14:10:53.954+01	2026-04-22 14:10:53.954+01	73
16	2025-05-05	132.00	127.00	119.00	128.00	122.00	À reprendre	\N	2026-04-22 14:10:53.957+01	2026-04-22 14:10:53.957+01	74
17	2025-05-05	256.00	198.00	248.00	243.00	254.00	À reprendre	\N	2026-04-22 14:10:53.969+01	2026-04-22 14:10:53.969+01	85
18	2025-05-05	204.00	190.00	189.00	199.00	212.00	À reprendre	\N	2026-04-22 14:10:53.972+01	2026-04-22 14:10:53.972+01	87
19	5025-05-06	90.00	85.00	80.00	87.00	90.00	À reprendre	\N	2026-04-22 14:10:53.985+01	2026-04-22 14:10:53.985+01	96
20	5025-05-06	100.00	115.00	99.00	120.00	100.00	À reprendre	\N	2026-04-22 14:10:53.987+01	2026-04-22 14:10:53.987+01	97
21	5025-05-06	130.00	140.00	135.00	128.00	133.00	À reprendre	\N	2026-04-22 14:10:53.994+01	2026-04-22 14:10:53.994+01	101
22	5025-05-06	160.00	165.00	178.00	173.00	160.00	À reprendre	\N	2026-04-22 14:10:53.996+01	2026-04-22 14:10:53.996+01	102
23	5025-05-06	170.00	200.00	183.00	180.00	197.00	À reprendre	\N	2026-04-22 14:10:53.998+01	2026-04-22 14:10:53.998+01	103
24	2025-05-06	250.00	200.00	253.00	248.00	259.00	À reprendre	\N	2026-04-22 14:10:54.009+01	2026-04-22 14:10:54.009+01	110
25	2025-05-06	100.00	99.00	85.00	89.00	93.00	À reprendre	\N	2026-04-22 14:10:54.015+01	2026-04-22 14:10:54.015+01	112
26	2025-05-06	122.00	115.00	135.00	129.00	114.00	À reprendre	\N	2026-04-22 14:10:54.017+01	2026-04-22 14:10:54.017+01	113
27	2025-05-06	130.00	140.00	110.00	99.00	135.00	À reprendre	\N	2026-04-22 14:10:54.019+01	2026-04-22 14:10:54.019+01	114
28	2025-05-06	156.00	144.00	133.00	188.00	150.00	À reprendre	\N	2026-04-22 14:10:54.021+01	2026-04-22 14:10:54.021+01	115
29	2025-05-06	156.00	144.00	133.00	188.00	150.00	À reprendre	\N	2026-04-22 14:10:54.023+01	2026-04-22 14:10:54.023+01	116
30	2025-05-06	120.00	225.00	205.00	247.00	262.00	À reprendre	\N	2026-04-22 14:10:54.025+01	2026-04-22 14:10:54.025+01	117
31	2025-05-06	330.00	312.00	301.00	315.00	322.00	À reprendre	\N	2026-04-22 14:10:54.028+01	2026-04-22 14:10:54.028+01	118
32	2025-05-07	70.00	63.00	61.00	78.00	20.00	À reprendre	\N	2026-04-22 14:10:54.049+01	2026-04-22 14:10:54.049+01	125
33	2025-05-07	90.00	100.00	89.00	99.00	102.00	À reprendre	\N	2026-04-22 14:10:54.051+01	2026-04-22 14:10:54.051+01	126
34	2025-05-07	90.00	100.00	89.00	99.00	102.00	À reprendre	\N	2026-04-22 14:10:54.058+01	2026-04-22 14:10:54.058+01	132
35	2025-04-14	160.00	93.00	91.00	89.00	41.00	À reprendre	\N	2026-04-22 14:10:54.166+01	2026-04-22 14:10:54.166+01	215
36	2025-04-14	120.00	115.00	120.00	124.00	113.00	À reprendre	\N	2026-04-22 14:10:54.168+01	2026-04-22 14:10:54.168+01	216
37	2025-04-14	111.00	132.00	134.00	125.00	140.00	À reprendre	\N	2026-04-22 14:10:54.17+01	2026-04-22 14:10:54.17+01	217
38	2025-04-14	160.00	93.00	91.00	89.00	41.00	À reprendre	\N	2026-04-22 14:10:54.171+01	2026-04-22 14:10:54.171+01	218
39	2025-04-14	120.00	115.00	120.00	124.00	113.00	À reprendre	\N	2026-04-22 14:10:54.174+01	2026-04-22 14:10:54.174+01	219
40	2025-04-14	111.00	132.00	134.00	125.00	140.00	À reprendre	\N	2026-04-22 14:10:54.177+01	2026-04-22 14:10:54.177+01	220
41	2025-05-07	93.00	120.00	99.00	90.00	95.00	À reprendre	\N	2026-04-22 14:10:54.251+01	2026-04-22 14:10:54.251+01	262
42	2025-05-07	130.00	140.00	129.00	145.00	136.00	À reprendre	\N	2026-04-22 14:10:54.253+01	2026-04-22 14:10:54.253+01	263
43	2025-05-07	183.00	178.00	188.00	181.00	180.00	À reprendre	\N	2026-04-22 14:10:54.255+01	2026-04-22 14:10:54.255+01	264
44	2025-05-07	270.00	275.00	280.00	281.00	279.00	À reprendre	\N	2026-04-22 14:10:54.258+01	2026-04-22 14:10:54.258+01	265
45	2025-05-12	82.00	114.00	96.00	111.00	83.00	À reprendre	\N	2026-04-22 14:10:54.289+01	2026-04-22 14:10:54.289+01	291
46	2025-05-12	158.00	135.00	139.00	129.00	125.00	À reprendre	\N	2026-04-22 14:10:54.293+01	2026-04-22 14:10:54.293+01	292
47	2025-05-12	203.00	177.00	203.00	200.00	2345.00	À reprendre	\N	2026-04-22 14:10:54.297+01	2026-04-22 14:10:54.297+01	293
48	2025-05-12	82.00	81.00	75.00	74.00	74.00	À reprendre	\N	2026-04-22 14:10:54.301+01	2026-04-22 14:10:54.301+01	294
49	2025-05-12	105.00	129.00	73.00	96.00	89.00	À reprendre	\N	2026-04-22 14:10:54.303+01	2026-04-22 14:10:54.303+01	295
50	2025-05-12	82.00	81.00	75.00	74.00	74.00	À reprendre	\N	2026-04-22 14:10:54.308+01	2026-04-22 14:10:54.308+01	297
51	2025-05-12	83.00	91.00	87.00	85.00	94.00	À reprendre	\N	2026-04-22 14:10:54.31+01	2026-04-22 14:10:54.31+01	298
52	2025-05-12	119.00	121.00	127.00	120.00	118.00	À reprendre	\N	2026-04-22 14:10:54.321+01	2026-04-22 14:10:54.321+01	311
53	2025-05-12	130.00	128.00	136.00	133.00	129.00	À reprendre	\N	2026-04-22 14:10:54.324+01	2026-04-22 14:10:54.324+01	312
54	2025-05-12	180.00	184.00	191.00	183.00	196.00	À reprendre	\N	2026-04-22 14:10:54.327+01	2026-04-22 14:10:54.327+01	313
55	2025-05-12	70.00	65.00	59.00	67.00	62.00	À reprendre	\N	2026-04-22 14:10:54.333+01	2026-04-22 14:10:54.333+01	314
56	2025-05-12	194.00	162.00	139.00	182.00	129.00	À reprendre	\N	2026-04-22 14:10:54.348+01	2026-04-22 14:10:54.348+01	324
57	2025-05-12	237.00	215.00	194.00	176.00	197.00	À reprendre	\N	2026-04-22 14:10:54.351+01	2026-04-22 14:10:54.351+01	326
58	2025-05-20	87.00	91.00	89.00	94.00	96.00	À reprendre	\N	2026-04-22 14:10:54.362+01	2026-04-22 14:10:54.362+01	333
59	2025-05-20	165.00	159.00	171.00	155.00	161.00	À reprendre	\N	2026-04-22 14:10:54.366+01	2026-04-22 14:10:54.366+01	336
60	2025-05-19	65.00	86.00	70.00	83.00	69.00	À reprendre	\N	2026-04-22 14:10:54.393+01	2026-04-22 14:10:54.393+01	349
61	2025-05-19	87.00	90.00	77.00	85.00	127.00	À reprendre	\N	2026-04-22 14:10:54.396+01	2026-04-22 14:10:54.396+01	350
62	2025-05-19	112.00	122.00	115.00	130.00	129.00	À reprendre	\N	2026-04-22 14:10:54.398+01	2026-04-22 14:10:54.398+01	351
63	2025-05-19	150.00	170.00	175.00	163.00	180.00	À reprendre	\N	2026-04-22 14:10:54.408+01	2026-04-22 14:10:54.408+01	359
64	2025-05-19	211.00	213.00	240.00	225.00	259.00	À reprendre	\N	2026-04-22 14:10:54.411+01	2026-04-22 14:10:54.411+01	360
65	2025-05-19	88.00	75.00	69.00	83.00	77.00	À reprendre	\N	2026-04-22 14:10:54.418+01	2026-04-22 14:10:54.418+01	363
66	2025-05-19	245.00	250.00	227.00	223.00	255.00	À reprendre	\N	2026-04-22 14:10:54.424+01	2026-04-22 14:10:54.424+01	367
67	2025-05-19	240.00	230.00	243.00	253.00	232.00	À reprendre	\N	2026-04-22 14:10:54.427+01	2026-04-22 14:10:54.427+01	368
68	2025-05-19	118.00	95.00	78.00	68.00	100.00	À reprendre	\N	2026-04-22 14:10:54.482+01	2026-04-22 14:10:54.482+01	380
69	2025-05-19	115.00	130.00	145.00	120.00	117.00	À reprendre	\N	2026-04-22 14:10:54.486+01	2026-04-22 14:10:54.486+01	382
70	2025-05-19	86.00	90.00	89.00	94.00	92.00	À reprendre	\N	2026-04-22 14:10:54.574+01	2026-04-22 14:10:54.574+01	412
71	2025-05-19	99.00	115.00	121.00	116.00	125.00	À reprendre	\N	2026-04-22 14:10:54.577+01	2026-04-22 14:10:54.577+01	413
72	2025-05-19	129.00	136.00	144.00	150.00	137.00	À reprendre	\N	2026-04-22 14:10:54.579+01	2026-04-22 14:10:54.579+01	414
73	2025-05-20	79.00	84.00	90.00	82.00	86.00	À reprendre	\N	2026-04-22 14:10:54.589+01	2026-04-22 14:10:54.589+01	421
74	2025-05-20	97.00	104.00	119.00	121.00	126.00	À reprendre	\N	2026-04-22 14:10:54.592+01	2026-04-22 14:10:54.592+01	422
75	2025-05-20	130.00	141.00	130.00	134.00	146.00	À reprendre	\N	2026-04-22 14:10:54.594+01	2026-04-22 14:10:54.594+01	423
76	2025-05-20	127.00	132.00	141.00	138.00	129.00	À reprendre	\N	2026-04-22 14:10:54.599+01	2026-04-22 14:10:54.599+01	427
77	2025-05-20	156.00	161.00	155.00	149.00	163.00	À reprendre	\N	2026-04-22 14:10:54.602+01	2026-04-22 14:10:54.602+01	428
78	2025-05-20	254.00	262.00	153.00	279.00	160.00	À reprendre	\N	2026-04-22 14:10:54.611+01	2026-04-22 14:10:54.611+01	434
79	2025-05-20	235.00	262.00	250.00	244.00	235.00	À reprendre	\N	2026-04-22 14:10:54.612+01	2026-04-22 14:10:54.612+01	435
80	2025-05-20	74.00	94.00	122.00	108.00	105.00	À reprendre	\N	2026-04-22 14:10:54.621+01	2026-04-22 14:10:54.621+01	445
81	2025-05-20	90.00	104.00	132.00	118.00	115.00	À reprendre	\N	2026-04-22 14:10:54.623+01	2026-04-22 14:10:54.623+01	446
82	2025-05-20	120.00	135.00	144.00	110.00	123.00	À reprendre	\N	2026-04-22 14:10:54.625+01	2026-04-22 14:10:54.625+01	447
83	2025-05-20	160.00	178.00	183.00	165.00	189.00	À reprendre	\N	2026-04-22 14:10:54.629+01	2026-04-22 14:10:54.629+01	452
84	2025-05-20	250.00	290.00	299.00	211.00	270.00	À reprendre	\N	2026-04-22 14:10:54.63+01	2026-04-22 14:10:54.63+01	453
85	2025-05-21	73.00	60.00	73.00	69.00	67.00	À reprendre	\N	2026-04-22 14:10:54.633+01	2026-04-22 14:10:54.633+01	454
86	2025-05-21	156.00	128.00	124.00	153.00	148.00	À reprendre	\N	2026-04-22 14:10:54.635+01	2026-04-22 14:10:54.635+01	455
87	2025-05-21	176.00	142.00	148.00	175.00	173.00	À reprendre	\N	2026-04-22 14:10:54.636+01	2026-04-22 14:10:54.636+01	456
88	2025-05-21	422.00	421.00	398.00	399.00	441.00	À reprendre	\N	2026-04-22 14:10:54.64+01	2026-04-22 14:10:54.64+01	457
89	2025-05-21	461.00	467.00	453.00	473.00	463.00	À reprendre	\N	2026-04-22 14:10:54.642+01	2026-04-22 14:10:54.642+01	458
90	2025-05-21	342.00	319.00	378.00	327.00	370.00	À reprendre	\N	2026-04-22 14:10:54.644+01	2026-04-22 14:10:54.644+01	459
91	2025-05-21	468.00	497.00	470.00	475.00	456.00	À reprendre	\N	2026-04-22 14:10:54.645+01	2026-04-22 14:10:54.645+01	460
92	2025-05-21	80.00	76.00	69.00	79.00	88.00	À reprendre	\N	2026-04-22 14:10:54.65+01	2026-04-22 14:10:54.65+01	462
93	2025-05-21	160.00	176.00	159.00	173.00	183.00	À reprendre	\N	2026-04-22 14:10:54.652+01	2026-04-22 14:10:54.652+01	463
94	2025-05-26	97.00	89.00	94.00	100.00	101.00	À reprendre	\N	2026-04-22 14:10:54.668+01	2026-04-22 14:10:54.668+01	471
95	2025-05-26	120.00	114.00	130.00	115.00	99.00	À reprendre	\N	2026-04-22 14:10:54.67+01	2026-04-22 14:10:54.67+01	472
96	2025-05-26	150.00	154.00	125.00	154.00	145.00	À reprendre	\N	2026-04-22 14:10:54.671+01	2026-04-22 14:10:54.671+01	473
97	2025-05-26	74.00	80.00	63.00	83.00	75.00	À reprendre	\N	2026-04-22 14:10:54.677+01	2026-04-22 14:10:54.677+01	477
98	2025-05-26	247.00	266.00	226.00	240.00	245.00	À reprendre	\N	2026-04-22 14:10:54.692+01	2026-04-22 14:10:54.692+01	487
99	2025-05-26	325.00	380.00	353.00	333.00	345.00	À reprendre	\N	2026-04-22 14:10:54.695+01	2026-04-22 14:10:54.695+01	488
100	2025-05-26	267.00	314.00	317.00	278.00	306.00	À reprendre	\N	2026-04-22 14:10:54.702+01	2026-04-22 14:10:54.702+01	490
101	2025-05-26	387.00	412.00	490.00	345.00	360.00	À reprendre	\N	2026-04-22 14:10:54.703+01	2026-04-22 14:10:54.703+01	491
102	2025-05-26	200.00	230.00	222.00	190.00	201.00	À reprendre	\N	2026-04-22 14:10:54.706+01	2026-04-22 14:10:54.706+01	493
103	2025-05-26	300.00	354.00	401.00	250.00	299.00	À reprendre	\N	2026-04-22 14:10:54.709+01	2026-04-22 14:10:54.709+01	494
104	2025-05-26	93.00	97.00	102.00	104.00	99.00	À reprendre	\N	2026-04-22 14:10:54.718+01	2026-04-22 14:10:54.718+01	498
105	2025-05-26	16.00	122.00	129.00	131.00	117.00	À reprendre	\N	2026-04-22 14:10:54.72+01	2026-04-22 14:10:54.72+01	499
106	2025-05-26	132.00	146.00	138.00	130.00	141.00	À reprendre	\N	2026-04-22 14:10:54.721+01	2026-04-22 14:10:54.721+01	500
107	2025-05-26	96.00	101.00	105.00	94.00	95.00	À reprendre	\N	2026-04-22 14:10:54.723+01	2026-04-22 14:10:54.723+01	501
108	2025-05-26	120.00	131.00	125.00	112.00	107.00	À reprendre	\N	2026-04-22 14:10:54.726+01	2026-04-22 14:10:54.726+01	502
109	2025-05-26	145.00	137.00	134.00	129.00	132.00	À reprendre	\N	2026-04-22 14:10:54.728+01	2026-04-22 14:10:54.728+01	503
110	2025-05-26	311.00	120.00	326.00	134.00	317.00	À reprendre	\N	2026-04-22 14:10:54.744+01	2026-04-22 14:10:54.744+01	518
111	2025-05-26	335.00	343.00	340.00	341.00	350.00	À reprendre	\N	2026-04-22 14:10:54.746+01	2026-04-22 14:10:54.746+01	519
112	2025-05-26	139.00	144.00	152.00	147.00	140.00	À reprendre	\N	2026-04-22 14:10:54.753+01	2026-04-22 14:10:54.753+01	525
113	2025-05-26	171.00	182.00	187.00	175.00	169.00	À reprendre	\N	2026-04-22 14:10:54.755+01	2026-04-22 14:10:54.755+01	526
114	2025-05-26	259.00	261.00	246.00	288.00	277.00	À reprendre	\N	2026-04-22 14:10:54.758+01	2026-04-22 14:10:54.758+01	527
115	2025-04-15	53.00	49.00	39.00	61.00	48.00	À reprendre	\N	2026-04-22 14:10:54.767+01	2026-04-22 14:10:54.767+01	532
116	2025-04-15	71.00	65.00	48.00	60.00	75.00	À reprendre	\N	2026-04-22 14:10:54.768+01	2026-04-22 14:10:54.768+01	533
117	2025-04-15	123.00	127.00	96.00	118.00	120.00	À reprendre	\N	2026-04-22 14:10:54.769+01	2026-04-22 14:10:54.769+01	534
118	2025-04-15	147.00	140.00	160.00	171.00	149.00	À reprendre	\N	2026-04-22 14:10:54.771+01	2026-04-22 14:10:54.771+01	535
119	2025-04-15	163.00	177.00	170.00	168.00	163.00	À reprendre	\N	2026-04-22 14:10:54.774+01	2026-04-22 14:10:54.774+01	536
120	2025-05-26	94.00	99.00	101.00	102.00	97.00	À reprendre	\N	2026-04-22 14:10:54.783+01	2026-04-22 14:10:54.783+01	541
121	2025-05-26	141.00	138.00	131.00	143.00	135.00	À reprendre	\N	2026-04-22 14:10:54.785+01	2026-04-22 14:10:54.785+01	543
122	2025-05-27	81.00	90.00	84.00	79.00	94.00	À reprendre	\N	2026-04-22 14:10:54.791+01	2026-04-22 14:10:54.791+01	544
123	2025-05-27	106.00	112.00	121.00	118.00	124.00	À reprendre	\N	2026-04-22 14:10:54.793+01	2026-04-22 14:10:54.793+01	545
124	2025-05-27	135.00	141.00	130.00	128.00	139.00	À reprendre	\N	2026-04-22 14:10:54.795+01	2026-04-22 14:10:54.795+01	546
125	5025-05-15	210.00	240.00	220.00	225.00	233.00	À reprendre	\N	2026-04-22 14:10:54.799+01	2026-04-22 14:10:54.799+01	547
126	5025-05-15	240.00	250.00	255.00	259.00	251.00	À reprendre	\N	2026-04-22 14:10:54.8+01	2026-04-22 14:10:54.8+01	548
127	5025-05-15	290.00	298.00	300.00	287.00	277.00	À reprendre	\N	2026-04-22 14:10:54.802+01	2026-04-22 14:10:54.802+01	549
128	2025-04-15	112.00	98.00	120.00	135.00	99.00	À reprendre	\N	2026-04-22 14:10:54.808+01	2026-04-22 14:10:54.808+01	553
129	2025-04-15	140.00	170.00	160.00	135.00	150.00	À reprendre	\N	2026-04-22 14:10:54.81+01	2026-04-22 14:10:54.81+01	554
130	2025-05-26	101.00	112.00	120.00	98.00	88.00	À reprendre	\N	2026-04-22 14:10:54.813+01	2026-04-22 14:10:54.813+01	555
131	2025-05-26	141.00	150.00	148.00	155.00	157.00	À reprendre	\N	2026-04-22 14:10:54.815+01	2026-04-22 14:10:54.815+01	556
132	2025-05-27	86.00	92.00	93.00	87.00	81.00	À reprendre	\N	2026-04-22 14:10:54.818+01	2026-04-22 14:10:54.818+01	557
133	2025-05-27	59.00	63.00	70.00	57.00	65.00	À reprendre	\N	2026-04-22 14:10:54.822+01	2026-04-22 14:10:54.822+01	558
134	2025-05-27	110.00	121.00	104.00	99.00	115.00	À reprendre	\N	2026-04-22 14:10:54.824+01	2026-04-22 14:10:54.824+01	559
135	2025-05-27	210.00	211.00	222.00	215.00	230.00	À reprendre	\N	2026-04-22 14:10:54.826+01	2026-04-22 14:10:54.826+01	560
136	2025-05-27	245.00	233.00	238.00	250.00	248.00	À reprendre	\N	2026-04-22 14:10:54.828+01	2026-04-22 14:10:54.828+01	561
137	2025-05-28	210.00	212.00	220.00	225.00	230.00	À reprendre	\N	2026-04-22 14:10:54.834+01	2026-04-22 14:10:54.834+01	562
138	2025-05-28	267.00	251.00	258.00	270.00	273.00	À reprendre	\N	2026-04-22 14:10:54.836+01	2026-04-22 14:10:54.836+01	563
139	2025-05-31	121.00	119.00	125.00	110.00	115.00	À reprendre	\N	2026-04-22 14:10:54.849+01	2026-04-22 14:10:54.849+01	570
140	2025-05-31	144.00	136.00	129.00	133.00	142.00	À reprendre	\N	2026-04-22 14:10:54.851+01	2026-04-22 14:10:54.851+01	571
141	2025-05-31	164.00	170.00	166.00	159.00	175.00	À reprendre	\N	2026-04-22 14:10:54.852+01	2026-04-22 14:10:54.852+01	572
142	2025-05-31	80.00	79.00	91.00	87.00	90.00	À reprendre	\N	2026-04-22 14:10:54.856+01	2026-04-22 14:10:54.856+01	573
143	2025-05-31	134.00	128.00	126.00	140.00	132.00	À reprendre	\N	2026-04-22 14:10:54.858+01	2026-04-22 14:10:54.858+01	574
144	2025-05-31	161.00	166.00	158.00	170.00	164.00	À reprendre	\N	2026-04-22 14:10:54.86+01	2026-04-22 14:10:54.86+01	575
145	2025-05-31	107.00	99.00	102.00	97.00	106.00	À reprendre	\N	2026-04-22 14:10:54.869+01	2026-04-22 14:10:54.869+01	579
146	2025-05-31	129.00	133.00	127.00	125.00	130.00	À reprendre	\N	2026-04-22 14:10:54.871+01	2026-04-22 14:10:54.871+01	580
147	2025-05-31	144.00	149.00	151.00	154.00	160.00	À reprendre	\N	2026-04-22 14:10:54.873+01	2026-04-22 14:10:54.873+01	581
148	2025-05-31	195.00	204.00	207.00	197.00	198.00	À reprendre	\N	2026-04-22 14:10:54.875+01	2026-04-22 14:10:54.875+01	582
149	2025-05-31	295.00	309.00	321.00	330.00	329.00	À reprendre	\N	2026-04-22 14:10:54.877+01	2026-04-22 14:10:54.877+01	583
150	2025-05-31	336.00	341.00	328.00	330.00	346.00	À reprendre	\N	2026-04-22 14:10:54.879+01	2026-04-22 14:10:54.879+01	584
151	2025-06-01	58.00	62.00	55.00	57.00	64.00	À reprendre	\N	2026-04-22 14:10:54.892+01	2026-04-22 14:10:54.892+01	595
152	2025-06-02	61.00	59.00	65.00	70.00	58.00	À reprendre	\N	2026-04-22 14:10:54.908+01	2026-04-22 14:10:54.908+01	603
153	2025-06-02	89.00	91.00	96.00	95.00	88.00	À reprendre	\N	2026-04-22 14:10:54.91+01	2026-04-22 14:10:54.91+01	604
154	2025-06-02	124.00	134.00	129.00	137.00	142.00	À reprendre	\N	2026-04-22 14:10:54.913+01	2026-04-22 14:10:54.913+01	605
155	2025-06-02	161.00	152.00	159.00	168.00	170.00	À reprendre	\N	2026-04-22 14:10:54.915+01	2026-04-22 14:10:54.915+01	606
156	2025-06-02	91.00	88.00	95.00	85.00	87.00	À reprendre	\N	2026-04-22 14:10:54.919+01	2026-04-22 14:10:54.919+01	607
157	2025-06-02	141.00	137.00	129.00	144.00	138.00	À reprendre	\N	2026-04-22 14:10:54.931+01	2026-04-22 14:10:54.931+01	608
158	2025-06-02	70.00	57.00	66.00	64.00	59.00	À reprendre	\N	2026-04-22 14:10:54.936+01	2026-04-22 14:10:54.936+01	610
159	2025-06-02	89.00	91.00	94.00	97.00	88.00	À reprendre	\N	2026-04-22 14:10:54.938+01	2026-04-22 14:10:54.938+01	611
160	2025-06-02	94.00	91.00	87.00	84.00	95.00	À reprendre	\N	2026-04-22 14:10:54.943+01	2026-04-22 14:10:54.943+01	613
161	2025-06-02	121.00	109.00	118.00	124.00	115.00	À reprendre	\N	2026-04-22 14:10:54.945+01	2026-04-22 14:10:54.945+01	614
162	2025-06-02	90.00	81.00	79.00	85.00	89.00	À reprendre	\N	2026-04-22 14:10:54.949+01	2026-04-22 14:10:54.949+01	616
163	2025-06-02	131.00	125.00	119.00	125.00	134.00	À reprendre	\N	2026-04-22 14:10:54.952+01	2026-04-22 14:10:54.952+01	618
164	2025-06-03	109.00	121.00	130.00	115.00	99.00	À reprendre	\N	2026-04-22 14:10:54.968+01	2026-04-22 14:10:54.968+01	624
165	2025-06-03	162.00	159.00	170.00	174.00	165.00	À reprendre	\N	2026-04-22 14:10:54.969+01	2026-04-22 14:10:54.969+01	625
166	2025-06-03	87.00	93.00	89.00	96.00	99.00	À reprendre	\N	2026-04-22 14:10:54.976+01	2026-04-22 14:10:54.976+01	626
167	2025-06-03	105.00	115.00	120.00	99.00	102.00	À reprendre	\N	2026-04-22 14:10:54.979+01	2026-04-22 14:10:54.979+01	627
168	2025-06-03	86.00	92.00	97.00	90.00	89.00	À reprendre	\N	2026-04-22 14:10:54.99+01	2026-04-22 14:10:54.99+01	628
169	2025-06-03	109.00	120.00	126.00	119.00	105.00	À reprendre	\N	2026-04-22 14:10:54.993+01	2026-04-22 14:10:54.993+01	629
170	2025-06-03	130.00	142.00	129.00	138.00	149.00	À reprendre	\N	2026-04-22 14:10:55+01	2026-04-22 14:10:55+01	632
171	2025-06-03	174.00	181.00	159.00	167.00	160.00	À reprendre	\N	2026-04-22 14:10:55.002+01	2026-04-22 14:10:55.002+01	633
172	2025-06-03	82.00	79.00	87.00	85.00	88.00	À reprendre	\N	2026-04-22 14:10:55.008+01	2026-04-22 14:10:55.008+01	634
173	2025-06-03	166.00	172.00	184.00	190.00	179.00	À reprendre	\N	2026-04-22 14:10:55.015+01	2026-04-22 14:10:55.015+01	637
174	2024-10-13	68.00	88.00	48.00	83.00	55.00	À reprendre	\N	2026-04-22 14:10:55.06+01	2026-04-22 14:10:55.06+01	664
175	2024-10-13	113.00	103.00	103.00	82.00	93.00	À reprendre	\N	2026-04-22 14:10:55.062+01	2026-04-22 14:10:55.062+01	665
176	2024-10-13	45.00	40.00	61.00	57.00	76.00	À reprendre	\N	2026-04-22 14:10:55.069+01	2026-04-22 14:10:55.069+01	673
177	2024-10-13	71.00	69.00	83.00	76.00	80.00	À reprendre	\N	2026-04-22 14:10:55.07+01	2026-04-22 14:10:55.07+01	674
\.


--
-- TOC entry 5708 (class 0 OID 41633)
-- Dependencies: 259
-- Data for Name: pince_preventive_records; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.pince_preventive_records (id, date_controle, numero_pince, reference_more, "position", cosse, fil, traction_minimale_n, test_value_1, test_value_2, test_value_3, test_value_4, test_value_5, date_prochaine, remarque, "createdAt", "updatedAt") FROM stdin;
1	2025-05-05	P1	539 773-2A	0.75	923919100	0.75	90	106.00	103.00	145.00	120.00	115.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
2	2025-05-05	P1	539 773-2A	1	923919100	1	115	144.00	135.00	120.00	162.00	156.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
3	2025-05-05	P1	539 773-2A	1.5	923919100	1.5	115	125.00	122.00	132.00	133.00	142.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
4	2025-05-05	P2	539 773-2A	0.75	923919000	0.75	90	106.00	103.00	145.00	120.00	115.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
5	2025-05-05	P2	539 773-2A	1	923919000	1	115	144.00	135.00	120.00	162.00	156.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
6	2025-05-05	P2	539 773-2A	1.5	923919000	1.5	115	125.00	122.00	132.00	133.00	142.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
7	2025-05-05	P3	S16SCML1	16	270567111	1.5	150	171.00	167.00	166.00	174.00	179.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
8	2025-05-05	P3	S16SCML1	18	270567111	0.75	90	105.00	112.00	126.00	122.00	99.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
9	2025-05-05	P5	58529-2	0,5-1,5	270600650	1.5	150	187.00	194.00	193.00	177.00	165.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
10	2025-05-05	P5	58529-2	0,5-1,5	270600650	0.75	90	110.00	108.00	112.00	107.00	115.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
11	2025-05-05	P5	58529-2	0,5-1,5	270600650	0.5	80	89.00	92.00	85.00	94.00	87.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
12	2025-05-05	P6	G1GEG454	0.5	270567026	0.5	89	102.00	91.00	88.00	138.00	99.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
13	2025-05-05	P6	G1GEG454	0.75	270567026	0.75	111	133.00	113.00	120.00	117.00	143.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
14	2025-05-05	P6	G1GEG454	1	270567026	1	111	183.00	175.00	181.00	192.00	136.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
15	2025-05-05	P6	G1GEG454	1.5	270567026	1.5	156	167.00	171.00	159.00	168.00	177.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
16	2025-05-05	P6	G1GEG454	2	270567075	2	311	319.00	324.00	320.00	331.00	316.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
17	2025-05-05	P6	G1GEG454	2.5	270567075	2.5	311	317.00	327.00	320.00	315.00	328.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
18	2025-05-05	P7	539 737-2/A	0,5 à 1	270567027	0.5	60	86.00	95.00	84.00	80.00	79.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
19	2025-05-05	P7	539 737-2/A	0,5 à 1	270567027	1	100	132.00	127.00	119.00	128.00	122.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
20	2025-05-05	P7	539 737-2/A	0,5 à 1	270567720	1.5	150	256.00	198.00	248.00	243.00	254.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
21	2025-05-05	P7	539 737-2/A	0,5 à 1	270567720	2.5	200	204.00	240.00	210.00	237.00	212.00	2025-11-01	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
22	2025-05-06	P8	GM12014254	0,5 à 2	270600460	0.5	75	90.00	76.00	80.00	78.00	90.00	2025-11-02	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
23	2025-05-06	P8	GM12014254	0,5 à 2	270600460	0.75	90	100.00	115.00	99.00	120.00	100.00	2025-11-02	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
24	2025-05-06	P9	97 33 02	2 a 4	270608920	0.35	60	250.00	200.00	253.00	248.00	259.00	2025-11-02	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
25	2025-05-06	P11	9040450000	22-18	M0211065012	0.5	60	100.00	99.00	85.00	89.00	93.00	2025-11-02	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
26	2025-05-06	P11	9040450000	22-18	M0211065012	0.75	85	122.00	115.00	135.00	129.00	114.00	2025-11-02	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
27	2025-05-06	P11	9040450000	22-18	M0211065012	1	108	130.00	140.00	110.00	99.00	135.00	2025-11-02	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
28	2025-05-06	P11	9040450000	16-14	270608920	1.5	150	156.00	144.00	133.00	188.00	150.00	2025-11-02	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
29	2025-05-06	P11	9040450000	16-14	270608920	2	192	120.00	225.00	205.00	247.00	262.00	2025-11-02	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
30	2025-05-06	P11	9040450000	16-14	270608920	2.5	230	330.00	312.00	301.00	315.00	322.00	2025-11-02	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
31	2025-06-02	p16	638118200P	16-14	270554240	2.5	230	120.00	99.00	100.00	102.00	115.00	2025-11-29	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
32	2025-05-07	P17	63819-0900	0,5 à 1,5	270600600	0.5	59	70.00	63.00	61.00	78.00	20.00	2025-11-03	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
33	2025-05-07	P17	63819-0900	0,5 à 1,5	270600600	0.75	88	90.00	100.00	89.00	99.00	102.00	2025-11-03	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
34	2025-05-07	P17	63819-0900	0,5 à 1,5	270606970	1.5	88	90.00	100.00	89.00	99.00	102.00	2025-11-03	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
35	2025-05-07	P21	CAGE11851	0,35 à 0,5	270567021	0.5	70	88.00	79.00	102.00	74.00	90.00	2025-11-03	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
36	2025-05-07	P21	CAGE11851	0.75	270567021	0.75	90	115.00	120.00	99.00	117.00	131.00	2025-11-03	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
37	2025-05-07	P21	CAGE11851	1	923921000	1	115	140.00	133.00	120.00	145.00	150.00	2025-11-03	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
38	2025-05-07	P21	CAGE11851	1.5	923921000	1.5	115	170.00	130.00	145.00	133.00	165.00	2025-11-03	\N	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
39	2025-05-05	P22	CAGE11851	1.5	270606840	6	360	170.00	130.00	145.00	133.00	165.00	2025-11-01	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
40	2025-05-05	P23	193990-2	1.5	270606810	6	360	170.00	130.00	145.00	133.00	165.00	2025-11-01	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
41	2025-05-05	P23	193991-4	1.5	270606740	6	360	170.00	130.00	145.00	133.00	165.00	2025-11-01	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
42	2025-10-19	P24	1864-28100	1.5	270567100   //     270567080   // 270567111  //270567081	1.5	150	149.00	151.00	180.00	161.00	170.00	2026-04-17	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
43	2025-10-11	P28	91592-1	0,5 à 0,8	270567042	0.5	60	66.00	69.00	73.00	78.00	70.00	2026-04-09	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
44	2025-10-11	P28	91592-1	0,5 à 0,8	270567042	0.75	85	86.00	88.00	90.00	95.00	101.00	2026-04-09	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
45	2025-10-11	P28	91592-1	0,5 à 0,8	270567042	1	108	120.00	130.00	123.00	128.00	133.00	2026-04-09	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
46	2025-10-11	P29	91592-1	0,5 à 0,8	270567042	0.5	60	108.00	110.00	90.00	88.00	120.00	2026-04-09	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
47	2025-10-11	P29	91592-1	0,5 à 0,8	270567042	0.75	85	120.00	133.00	141.00	99.00	111.00	2026-04-09	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
48	2025-10-11	P29	91592-1	0,5 à 0,8	270567042	1	108	130.00	115.00	121.00	116.00	231.00	2026-04-09	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
49	2025-10-19	P30	91583-1	0,8-2mm²	270567043	0.75	85	130.00	115.00	121.00	116.00	231.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
50	2025-10-19	P30	91583-1	0,8-2mm²	270567043	1	108	130.00	115.00	121.00	116.00	231.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
51	2025-10-19	P30	91583-1	0,8-2mm²	270567043	2	200	130.00	115.00	121.00	116.00	231.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
52	2025-05-07	P31	S16SCM20	0,5 à 2	270599980	0.5	58	83.00	86.00	90.00	80.00	87.00	2025-11-03	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
53	2025-05-07	P31	S16SCM20	0,5 à 2	270599980	1	89	127.00	134.00	119.00	121.00	126.00	2025-11-03	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
54	2025-05-07	P31	S16SCM20	0,5 à 2	270599980	1.5	134	156.00	149.00	144.00	152.00	161.00	2025-11-03	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
55	2025-10-19	P32	91505-1	0,5 à 2	270614120	0.5	60	156.00	149.00	144.00	152.00	161.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
56	2025-10-19	P32	91505-1	0,5 à 2	270614120	0.75	75	156.00	149.00	144.00	152.00	161.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
57	2025-10-19	P32	91505-1	0,5 à 2	270614120	1	108	156.00	149.00	144.00	152.00	161.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
58	2025-10-19	P33	WC-691	0,5 à 2	270569970	1.5	134	156.00	149.00	144.00	152.00	161.00	2026-04-17	manque pance	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
59	2025-05-07	P34	C113007/4809	0,5 à 2	270608590	0.5	60	93.00	120.00	99.00	90.00	95.00	2025-11-03	manque pance	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
60	2025-05-07	P34	C113007/4809	0,5 à 2	270608590	1	108	130.00	140.00	129.00	145.00	136.00	2025-11-03	manque pance	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
61	2025-05-07	P34	C113007/4809	0,5 à 2	270608590	1.5	150	183.00	178.00	188.00	181.00	180.00	2025-11-03	manque pance	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
62	2025-05-07	P34	C113007/4809	0,5 à 2	270608590	2	200	270.00	275.00	280.00	281.00	279.00	2025-11-03	manque pance	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
63	2025-10-19	P35	A51673	0,5 à 2	270608760	0.75	85	270.00	275.00	280.00	281.00	279.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
64	2025-10-19	P35	A51673	0,5 à 2	270608760	1	108	270.00	275.00	280.00	281.00	279.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
65	2025-10-19	P35	A51673	0,5 à 2	270608760	1.5	150	270.00	275.00	280.00	281.00	279.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
66	2025-10-19	P35	A51673	0,5 à 2	270608760	2	200	270.00	275.00	280.00	281.00	279.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
67	2025-10-19	P36	A510600	0,5 à 2	270608830	0.35	40	270.00	275.00	280.00	281.00	279.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
68	2025-10-19	P36	A510600	0,5 à 2	270608830	0.5	60	270.00	275.00	280.00	281.00	279.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
69	2025-10-19	P36	A510600	0,5 à 2	270608830	1	108	270.00	275.00	280.00	281.00	279.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
70	2025-10-19	P36	A510600	0,5 à 2	270608830	1.5	150	270.00	275.00	280.00	281.00	279.00	2026-04-17	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
71	2025-10-11	P37	_	0,2 à 0,6	270608640	0.35	40	64.00	70.00	69.00	72.00	59.00	2026-04-09	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
72	2025-10-11	P37	_	0,2 à 0,6	270608640	0.5	60	84.00	79.00	87.00	90.00	92.00	2026-04-09	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
73	2025-05-12	P38	071/918	0,5 à 1,25	270608610	0.5	60	82.00	114.00	96.00	111.00	83.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
74	2025-05-12	P38	071/918	0,5 à 1,25	270608610	0.75	85	158.00	135.00	139.00	129.00	125.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
75	2025-05-12	P38	071/918	0,5 à 1,25	270608610	1.5	150	203.00	177.00	203.00	200.00	2345.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
76	2025-05-12	P39	916039	0,35 à 0,5	270609470	0.35	40	82.00	81.00	75.00	74.00	74.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
77	2025-05-12	P39	916039	0,35 à 0,5	270609470	0.5	60	105.00	129.00	73.00	96.00	89.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
78	2025-05-12	P40	_	20 à 24	270609030	0.35	44	82.00	81.00	75.00	74.00	74.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
79	2025-05-12	P40	_	20 à 24	270609030	0.5	75	83.00	91.00	87.00	85.00	94.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
80	2025-05-12	P40	5-1579001-1/A	16 à18	270606710	0.75	111	119.00	121.00	127.00	120.00	118.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
81	2025-05-12	P40	5-1579001-1/A	16 à18	270606710	1	111	130.00	128.00	136.00	133.00	129.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
82	2025-05-12	P40	5-1579001-1/A	16 à18	270606710	1.5	178	180.00	184.00	191.00	183.00	196.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
83	2025-06-02	p41	5-1579001-1/A	16 à18	270611430	0.35	60	60.00	69.00	75.00	80.00	68.00	2025-11-29	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
84	2025-05-12	P42	CAGE11851	0,5 à0,34	270614750	0.34	40	70.00	65.00	59.00	67.00	62.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
85	2025-05-12	P43	539 663-2/A	0,75 à 2	270608560	0.75	85	194.00	162.00	139.00	182.00	129.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
86	2025-05-12	P43	539 663-2/A	0,75 à 2	270608560	1	108	194.00	162.00	139.00	182.00	129.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
87	2025-05-12	P43	539 663-2/A	0,75 à 2	270608560	1.5	150	155.00	158.00	160.00	167.00	159.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
88	2025-05-12	P43	539 663-2/A	0,75 à 2	270608560	2	200	237.00	215.00	194.00	176.00	197.00	2025-11-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
89	2025-05-20	P44	539 950-2/A	0,35 à1,5	270609950	0.5	45	87.00	91.00	89.00	94.00	96.00	2025-11-16	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
90	2025-05-20	P44	539 950-2/A	0,35 à1,5	270609950	1.5	89	165.00	159.00	171.00	155.00	161.00	2025-11-16	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
91	2025-10-10	P48	539 726-2/A	0.35 a 1.5	270607660	0.35	40	165.00	159.00	171.00	155.00	161.00	2026-04-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
92	2025-10-10	P48	539 726-2/A	0.35 a 1.5	270607660	0.5	60	165.00	159.00	171.00	155.00	161.00	2026-04-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
93	2025-10-10	P48	539 726-2/A	0.35 a 1.5	270607660	0.75	85	165.00	159.00	171.00	155.00	161.00	2026-04-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
94	2025-10-10	P48	539 726-2/A	0.35 a 1.5	270607660	1	108	165.00	159.00	171.00	155.00	161.00	2026-04-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
95	2025-10-10	P48	539 726-2/A	0.35 a 1.5	270607660	1.5	150	165.00	159.00	171.00	155.00	161.00	2026-04-08	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
96	2025-05-19	P49	3-1579021-7/A	0,5 à 1,25	270607170	0.5	60	65.00	86.00	70.00	83.00	69.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
97	2025-05-19	P49	3-1579021-7/A	0,5 à 1,25	270607170	0.75	60	87.00	90.00	77.00	85.00	127.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
98	2025-05-19	P49	3-1579021-7/A	0,5 à 1,25	270607170	1	100	112.00	122.00	115.00	130.00	129.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
99	2025-05-19	P49	3-1579021-7/A	0,5 à 1,25	270607840	1.5	150	150.00	170.00	175.00	163.00	180.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
100	2025-05-19	P49	3-1579021-7/A	0,5 à 1,25	270607840	2.5	200	211.00	213.00	240.00	225.00	259.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
101	2025-05-19	P50	66-0003-001	0,14-1-1,5-2,5-4	270599170	0.5	60	66.00	68.00	63.00	70.00	69.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
102	2025-05-19	P50	66-0003-001	0,14-1-1,5-2,5-4	270599130	1.5	150	245.00	250.00	227.00	223.00	255.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
103	2025-05-19	P50	66-0003-001	0,14-1-1,5-2,5-4	270608150	2.5	230	245.00	250.00	227.00	223.00	255.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
104	2025-05-19	P51	66-0003-001	0,5 à 1	270610170	0.5	67	118.00	95.00	78.00	68.00	100.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
105	2025-05-19	P51	66-0003-001	0,5 à 1	270610170	0.75	85	90.00	92.00	100.00	88.00	102.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
106	2025-05-19	P51	66-0003-001	0,5 à 1	270610170	1	110	115.00	130.00	145.00	120.00	117.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
107	2025-05-19	P52	916039	0,5 à 1	270610160	0.5	67	118.00	95.00	78.00	68.00	100.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
108	2025-05-19	P52	916039	0,5 à 1	270610160	0.75	85	90.00	102.00	115.00	99.00	89.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
109	2025-05-19	P52	916039	0,5 à 1	270610160	1	110	115.00	130.00	145.00	120.00	117.00	2025-11-15	Manque Cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
110	2025-10-15	P53	5-1579001-1/A	0,5 à 0.75	270609340\n270614310	0.5	60	115.00	130.00	145.00	120.00	117.00	\N	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
111	2025-10-15	P53	5-1579001-1/A	0,5 à 0.75	270609340\n270614310	0.75	85	115.00	130.00	145.00	120.00	117.00	\N	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
112	2025-10-19	P54	91594-1	0,5 à 1	270610250	0.35	50	115.00	130.00	145.00	120.00	117.00	2026-04-17	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
113	2025-10-19	P54	91594-1	0,5 à 1	270610250	0.5	60	115.00	130.00	145.00	120.00	117.00	2026-04-17	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
114	2025-10-19	P54	91594-1	0,5 à 1	270610250	0.75	85	115.00	130.00	145.00	120.00	117.00	2026-04-17	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
115	2025-10-19	P54	91594-1	0,5 à 1	270610200	1	108	115.00	130.00	145.00	120.00	117.00	2026-04-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
116	2025-05-19	P57	539 663-2/A	0,5 à1	270608200	0.5	60	86.00	90.00	89.00	94.00	92.00	2025-11-15	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
117	2025-05-19	P57	539 663-2/A	0,5 à1	270608200	0.75	85	99.00	115.00	121.00	116.00	125.00	2025-11-15	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
118	2025-05-19	P57	539 663-2/A	0,5 à1	270608200	1	108	129.00	136.00	144.00	150.00	137.00	2025-11-15	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
119	2025-05-20	P58	539 950-2/A	0,5 à 1	270608000	0.5	60	79.00	84.00	90.00	82.00	86.00	2025-11-16	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
120	2025-05-20	P58	539 950-2/A	0,5 à 1	270608000	0.75	85	97.00	104.00	119.00	121.00	126.00	2025-11-16	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
121	2025-05-20	P58	539 950-2/A	0,5 à 1	270608000	1	108	130.00	141.00	130.00	134.00	146.00	2025-11-16	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
122	2025-05-20	P59	5-1579001-3/A	1 à 1,5	270608010	1	108	127.00	132.00	141.00	138.00	129.00	2025-11-16	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
123	2025-05-20	P59	5-1579001-3/A	1 à 1,5	270608010	1.5	135	156.00	161.00	155.00	149.00	163.00	2025-11-16	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
124	2025-05-21	P60	539 727-2/A	1 à 2,5	270608260	1.5	150	254.00	262.00	153.00	279.00	160.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
125	2025-05-21	P60	539 727-2/A	1 à 2,5	270608260	2.5	200	235.00	262.00	250.00	244.00	235.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
126	2025-05-21	P61	539 758-2/A	1,5 à 2,5	270608210	1.5	150	160.00	178.00	183.00	165.00	189.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
127	2025-05-21	P61	539 758-2/A	1,5 à 2,5	270608210	2.5	200	250.00	290.00	299.00	211.00	270.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
128	2025-05-21	P62	539 726-2/A	0,5 à 1	270610540	0.5	60	73.00	60.00	73.00	69.00	67.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
129	2025-05-21	P62	539 726-2/A	0,5 à 1	270610540	0.75	85	156.00	128.00	124.00	153.00	148.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
130	2025-05-21	P62	539 726-2/A	0,5 à 1	270610540	1	108	176.00	142.00	148.00	175.00	173.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
131	2025-05-21	P63	3-1579021-7/A	4 à 6	270610550	4	310	422.00	421.00	398.00	399.00	441.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
132	2025-05-21	P63	3-1579021-7/A	4 à 6	270610550	6	450	461.00	467.00	453.00	473.00	463.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
133	2025-05-21	P65	1864-28100	0,8 à 2	270567043	1.5	62	80.00	76.00	69.00	79.00	88.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
134	2025-05-21	P65	1864-28100	0,8 à 2	270567043	2	62	160.00	176.00	159.00	173.00	183.00	2025-11-17	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
135	2025-05-26	P70	539 651-2/A	0,5 à 1,5	270611160	0.5	≥ 60	97.00	89.00	94.00	100.00	101.00	2025-11-22	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
136	2025-05-26	P70	539 651-2/A	0,5 à 1,5	270611160	0.75	≥ 85	120.00	114.00	130.00	115.00	99.00	2025-11-22	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
137	2025-05-26	P70	539 651-2/A	0,5 à 1,5	270611160	1	≥ 100	150.00	154.00	125.00	154.00	145.00	2025-11-22	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
138	2025-05-26	P71	X116996	0,12 à 0,32	270611430	0.35	50	74.00	80.00	68.00	83.00	75.00	2025-11-22	manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
139	2025-11-25	P72	X116996	3.5	270611340	2.5	150	176.00	184.00	183.00	190.00	179.00	2026-05-24	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
140	2025-11-25	P73	X116996	0,5 à 2	270611400	0.5	65	87.00	91.00	82.00	94.00	89.00	2026-05-24	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
141	2025-11-25	P73	X116996	0,5 à 2	270611400	1	90	125.00	131.00	140.00	137.00	128.00	2026-05-24	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
142	2025-11-25	P73	X116996	0,5 à 2	270611400	2	150	184.00	192.00	188.00	179.00	174.00	2026-05-24	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
143	2025-05-26	P75	DTT-12-00	2 à 4	270600870	2	≥ 222	247.00	266.00	226.00	240.00	245.00	2025-11-22	P75 changer par P74	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
144	2025-05-26	P75	DTT-12-00	2 à 4	270600870	4	311	325.00	380.00	353.00	333.00	345.00	2025-11-22	P75 changer par P74	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
145	2025-05-26	P76	539 679-2/B	1 à 2,5	270609790	1.5	150	267.00	314.00	317.00	278.00	306.00	2025-11-22	P75 changer par P74	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
146	2025-05-26	P76	539 679-2/B	1 à 2,5	270609790	2.5	200	387.00	412.00	490.00	345.00	360.00	2025-11-22	P75 changer par P74	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
147	2025-08-22	P78	91522-1	0,35 à 0,75	270610250	0.34	49	387.00	412.00	490.00	345.00	360.00	2026-02-18	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
148	2025-08-22	P78	91522-1	0,35 à 0,75	270610250	0.5	58	387.00	412.00	490.00	345.00	360.00	2026-02-18	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
149	2025-08-22	P78	91522-1	0,35 à 0,75	270610250	0.75	67	387.00	412.00	490.00	345.00	360.00	2026-02-18	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
150	2025-05-26	P79	1579024-3	0,5à1	270609770	0.5	60	93.00	97.00	102.00	104.00	99.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
151	2025-05-26	P79	1579024-3	0,5à1	270609770	0.75	85	16.00	122.00	129.00	131.00	117.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
152	2025-05-26	P79	1579024-3	0,5à1	270609770	1	100	132.00	146.00	138.00	130.00	141.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
153	2025-05-26	P80	438-521	4 à 6	270613570	4	≥311	311.00	120.00	326.00	134.00	317.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
154	2025-05-26	P80	438-521	4 à 6	270613570	6	≥311	335.00	343.00	340.00	341.00	350.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
155	2025-05-26	P81	609	1 à 2,5	270610660	1	100	139.00	144.00	152.00	147.00	140.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
156	2025-05-26	P81	609	1 à 2,5	270610660	1.5	150	171.00	182.00	187.00	175.00	169.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
157	2025-05-26	P81	609	1 à 2,5	270610660	2.5	200	259.00	261.00	246.00	288.00	277.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
158	2025-10-14	P83	1623MFX-3954	_	270612020	0.35	≥ 45	53.00	49.00	59.00	61.00	48.00	2026-04-13	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
159	2025-10-14	P83	1623MFX-3954	_	270612020	0.5	≥ 58	71.00	65.00	48.00	60.00	75.00	2026-04-13	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
160	2025-05-26	P85	539 955-2/A	0,5 à 1	270612970	0.5	≥ 60	94.00	99.00	101.00	102.00	97.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
161	2025-05-26	P85	539 955-2/A	0,5 à 1	270612970	1	≥ 140	141.00	138.00	131.00	143.00	135.00	2025-11-22	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
162	2025-05-27	P86	539 757-2/A	0,5 à 1	270612980	0.5	60	81.00	90.00	84.00	79.00	94.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
163	2025-05-27	P86	539 757-2/A	0,5 à 1	270612980	0.75	85	106.00	112.00	121.00	118.00	124.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
164	2025-05-27	P86	539 757-2/A	0,5 à 1	270612980	1	108	135.00	141.00	130.00	128.00	139.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
165	2025-05-27	P87	15S3F178060103	1,5a 2,5	270613350	1.5	200	210.00	240.00	220.00	225.00	233.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
166	2025-05-27	P87	15S3F178060103	1,5a 2,5	270613350	2	230	240.00	250.00	255.00	259.00	251.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
167	2025-05-27	P87	15S3F178060103	1,5a 2,5	270613350	2.5	250	290.00	298.00	300.00	287.00	277.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
168	2025-05-27	P89	28S3F178061103	0,50 à 0,75	270613340	0.5	80	101.00	112.00	120.00	98.00	88.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
169	2025-05-27	P89	28S3F178061103	0,50 à 0,75	270613340	0.75	140	141.00	150.00	148.00	155.00	157.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
170	2025-05-27	P90	1454509-2	0.5	270613280	0.5	≥ 65	86.00	92.00	93.00	87.00	81.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
171	2025-05-27	P91	15S3F178060103	1,5 à 2	270617450	1.5	200	210.00	211.00	222.00	215.00	230.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
172	2025-05-27	P91	15S3F178060103	1,5 à 2	270617450	2	230	245.00	233.00	238.00	250.00	248.00	2025-11-23	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
173	2025-05-28	P93	28S3F178061103	1,5 à 2,5	270617460	1.5	200	201.00	212.00	220.00	225.00	230.00	2025-11-24	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
174	2025-05-28	P93	28S3F178061103	1,5 à 2,5	270617460	2.5	250	267.00	251.00	258.00	270.00	273.00	2025-11-24	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
175	2025-05-31	P96	121586-5237	0,5 à 1	270613780	0.75	85	120.00	125.00	133.00	115.00	121.00	2025-11-27	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
176	2025-05-31	P96	121586-5237	0,5 à 1	270613780	1	100	149.00	133.00	145.00	146.00	148.00	2025-11-27	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
177	2025-05-31	P96	121586-5237	0,5 à 1	270613780	1.5	150	160.00	175.00	168.00	163.00	170.00	2025-11-27	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
178	2025-05-31	P97	58628-2	0,35 à 2	270614220	0.5	60	83.00	85.00	96.00	101.00	75.00	2025-11-27	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
179	2025-05-31	P97	58628-2	0,35 à 2	270614220	1	100	140.00	138.00	141.00	133.00	136.00	2025-11-27	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
180	2025-05-31	P97	58628-2	0,35 à 2	270614220	1.5	150	160.00	169.00	168.00	181.00	175.00	2025-11-27	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
181	2025-05-31	P100	58628-2	0,5 à 6	270600100	0.5	60	89.00	96.00	96.00	98.00	100.00	2025-11-27	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
182	2025-05-31	P100	58628-2	0,5 à 6	270600100	75	85	165.00	128.00	156.00	172.00	129.00	2025-11-27	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
183	2025-05-31	P100	58628-2	0,5 à 6	270600100	1	108	170.00	179.00	180.00	175.00	160.00	2025-11-27	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
184	2025-06-02	P102	WC-260	0,05 à 033	923926200	0.35	50	60.00	69.00	75.00	80.00	68.00	2025-11-29	Manque de cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
185	2025-09-07	103	539635-1 + \n539758-0	0,5 à 2,5 mm128	270614920	0.5	60	60.00	69.00	75.00	80.00	68.00	2026-03-06	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
186	2025-09-07	103	539635-1 + \n539758-0	0,5 à 2,5 mm128	270614920	0.75	85	60.00	69.00	75.00	80.00	68.00	2026-03-06	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
187	2025-09-07	103	539635-1 + \n539758-0	0,5 à 2,5 mm128	270614920	1	108	60.00	69.00	75.00	80.00	68.00	2026-03-06	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
188	2025-06-02	P106	F745266	0,35-1,5	270614360	0.35	50	71.00	69.00	75.00	80.00	68.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
189	2025-06-02	P106	F745266	0,35-1,5	270614360	0.5	60	99.00	101.00	106.00	105.00	98.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
190	2025-06-02	P107	A1831	0,5-1	270613320	0.5	≥ 60	101.00	98.00	105.00	95.00	97.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
191	2025-06-02	P107	A1831	0,5-1	270613320	1	≥ 110	151.00	147.00	139.00	154.00	148.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
192	2025-06-02	P108	HT-8656-3005	0,35_0,5	270614750	0.35	50	80.00	67.00	76.00	74.00	69.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
193	2025-06-02	P108	HT-8656-3005	0,35_0,5	270614750	0.5	60	99.00	101.00	104.00	107.00	98.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
194	2025-06-02	P109	ES13888	0,5_0,75	270616670	0.5	≥ 70	104.00	101.00	97.00	94.00	105.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
195	2025-06-02	P109	ES13888	0,5_0,75	270616670	0.75	≥ 90	131.00	119.00	129.00	134.00	125.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
196	2025-06-02	P110	ES77322	0,5_1	270616680	0.5	≥ 70	100.00	91.00	89.00	95.00	99.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
197	2025-06-02	P110	ES77322	0,5_1	270616680	1	≥ 115	141.00	135.00	129.00	135.00	144.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
198	2025-06-03	P113	ES77322	1	270616200	1	≥ 160	173.00	167.00	169.00	163.00	178.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
199	2025-06-03	P114	13782705	0,35-0,75	270616220	0.35	≥ 50	80.00	77.00	81.00	86.00	76.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
200	2025-06-03	P114	13782705	0,35-0,75	270616220	0.5	≥ 60	94.00	88.00	90.00	100.00	112.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
201	2025-06-03	P114	13782705	0,35-0,75	270616220	0.75	85	133.00	139.00	148.00	142.00	149.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
202	2025-06-03	P115	2119118-2	0,75_1,5	270616780	0.75	85	137.00	133.00	167.00	135.00	168.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
203	2025-06-03	P115	2119118-2	0,75_1,5	270616780	1.5	150	172.00	169.00	180.00	184.00	175.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
204	2025-06-03	P117	63811-6200	0,5_0,75	270616820	0.5	60	97.00	103.00	99.00	106.00	109.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
205	2025-06-03	P117	63811-6200	0,5_0,75	270616820	0.75	85	115.00	125.00	130.00	109.00	112.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
206	2025-06-03	P118	63811-6200	0,22_0,35	270617400	0.35	50	92.00	84.00	89.00	95.00	81.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
207	2025-06-03	P121	63819-3470	0,5_0,75	270617070	0.5	≥ 70	96.00	102.00	107.00	100.00	99.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
208	2025-06-03	P121	63819-3470	0,5_0,75	270617070	0.75	≥ 90	119.00	130.00	136.00	129.00	115.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
209	2025-06-03	P123	63819-3470	0,14-1-1,5-2,5-4	270599130	1.5	150	184.00	191.00	169.00	177.00	170.00	2025-11-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
210	2025-04-03	P125 bis	63819-3470	0.34	23002468	0.34	68	82.00	79.00	87.00	85.00	88.00	2026-09-30	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
211	2025-06-02	p130	63819-3470	0.34	923922200	1	108	80.00	88.00	95.00	83.00	81.00	2025-11-29	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
212	2025-10-13	P137	638190000G	0,34 - 0,5	270624430	0.34	≥ 35,6	50.00	51.00	49.00	48.00	60.00	2026-04-11	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
213	2025-10-13	P137	638190000G	0,34 - 0,5	270624430	0.5	≥ 57,8	80.00	91.00	77.00	81.00	73.00	2026-04-11	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
214	2025-07-09	P138	L470459	0,5-1,5	270626480	0.5	60	77.00	91.00	77.00	81.00	73.00	2027-01-10	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
215	2025-07-09	P138	L470459	0,5-1,5	270626480	1	108	131.00	91.00	77.00	81.00	73.00	2027-01-10	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
216	2025-07-09	P138	L470459	0,5-1,5	270626480	1.5	150	188.00	91.00	77.00	81.00	73.00	2027-01-10	Manque cosse	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
217	2025-06-02	p200	L470459	0,5-1,5	270621880	1.5	150	188.00	91.00	77.00	81.00	73.00	2025-11-29	verefication visuelle	2026-04-13 11:03:12.551+01	2026-04-13 11:03:12.551+01
\.


--
-- TOC entry 5699 (class 0 OID 24714)
-- Dependencies: 250
-- Data for Name: pince_variants; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.pince_variants (id, reference_constructeur, reference_tec, section_mm, section_awg, longueur_denudage, valeur_traction, affectation, remarque, "createdAt", "updatedAt", pince_id) FROM stdin;
1	183024-1	923920000	1.00	\N	3.5	≥ 115	\N	\N	2026-04-22 14:10:53.839+01	2026-04-22 14:10:53.839+01	1
2	183024-1	923920000	0.75	\N	3.5	≥ 90	\N	\N	2026-04-22 14:10:53.842+01	2026-04-22 14:10:53.842+01	1
3	183024-1	923920000	1.50	\N	3.5	≥ 155	\N	\N	2026-04-22 14:10:53.844+01	2026-04-22 14:10:53.844+01	1
4	183025-1	923919000	0.75	\N	3 à 3,5	≥ 90	\N	\N	2026-04-22 14:10:53.846+01	2026-04-22 14:10:53.846+01	1
5	183025-1	923919000	1.00	\N	3 à 3,5	≥ 115	\N	\N	2026-04-22 14:10:53.847+01	2026-04-22 14:10:53.847+01	1
6	183025-1	923919000	1.50	\N	3 à 3,5	≥ 155	\N	\N	2026-04-22 14:10:53.848+01	2026-04-22 14:10:53.848+01	1
7	282109-1	923921000	0.75	\N	3 à 3,5	≥ 85	\N	\N	2026-04-22 14:10:53.849+01	2026-04-22 14:10:53.849+01	1
8	282109-1	923921000	1.00	\N	3 à 3,5	≥ 115	\N	\N	2026-04-22 14:10:53.85+01	2026-04-22 14:10:53.85+01	1
9	282109-1	923921000	1.50	\N	3 à 3,5	≥ 155	\N	\N	2026-04-22 14:10:53.851+01	2026-04-22 14:10:53.851+01	1
10	282110-1	923919100	0.75	\N	3 à 3,5	≥ 90	\N	\N	2026-04-22 14:10:53.851+01	2026-04-22 14:10:53.851+01	1
11	282110-1	923919100	1.00	\N	3 à 3,5	≥ 115	\N	\N	2026-04-22 14:10:53.855+01	2026-04-22 14:10:53.855+01	1
12	282110-1	923919100	1.50	\N	3 à 3,5	≥ 155	\N	\N	2026-04-22 14:10:53.858+01	2026-04-22 14:10:53.858+01	1
13	183036-1	270567010	0.35	\N	3 à 3,5	≥ 60	\N	cosse -50 pieces	2026-04-22 14:10:53.861+01	2026-04-22 14:10:53.861+01	1
14	183036-1	270567010	0.50	\N	3 à 3,5	≥ 70	\N	\N	2026-04-22 14:10:53.862+01	2026-04-22 14:10:53.862+01	1
15	282404-1	270567011	0.35	\N	3 à 3,5	≥ 60	\N	\N	2026-04-22 14:10:53.863+01	2026-04-22 14:10:53.863+01	1
16	282404-1	270567011	0.50	\N	3 à 3,5	≥ 70	\N	\N	2026-04-22 14:10:53.864+01	2026-04-22 14:10:53.864+01	1
17	183035-1	270567020	0.35	\N	3 à 3,5	≥ 60	\N	\N	2026-04-22 14:10:53.865+01	2026-04-22 14:10:53.865+01	1
18	183035-1	270567020	0.50	\N	3 à 3,5	≥ 70	\N	\N	2026-04-22 14:10:53.866+01	2026-04-22 14:10:53.866+01	1
19	282403-1	270567021	0.35	\N	3 à 3,5	≥ 60	\N	\N	2026-04-22 14:10:53.866+01	2026-04-22 14:10:53.866+01	1
20	282403-1	270567021	0.50	\N	3 à 3,5	≥ 70	\N	\N	2026-04-22 14:10:53.867+01	2026-04-22 14:10:53.867+01	1
21	282466-1	270567128	1.50	\N	3,5 à 4	≥ 155	\N	manque cosse	2026-04-22 14:10:53.87+01	2026-04-22 14:10:53.87+01	1
22	282466-1	270567128	2.50	\N	3,5 à 4	≥ 230	\N	\N	2026-04-22 14:10:53.871+01	2026-04-22 14:10:53.871+01	1
23	282465-1	270599190	1.50	\N	3,5 à 4	≥ 155	\N	\N	2026-04-22 14:10:53.872+01	2026-04-22 14:10:53.872+01	1
24	282465-1	270599190	2.50	\N	3,5 à 4	≥ 230	\N	\N	2026-04-22 14:10:53.873+01	2026-04-22 14:10:53.873+01	1
25	SM16ML-1D70	270567080	0.80	\N	6.35	≥ 90	\N	\N	2026-04-22 14:10:53.877+01	2026-04-22 14:10:53.877+01	2
26	SM16ML-1D70	270567080	1.50	\N	6.35	≥ 150	\N	\N	2026-04-22 14:10:53.878+01	2026-04-22 14:10:53.878+01	2
27	SM16M-1S31	270567081	0.80	\N	6.35	≥ 90	\N	\N	2026-04-22 14:10:53.879+01	2026-04-22 14:10:53.879+01	2
28	SM16M-1S31	270567081	1.50	\N	6.35	≥ 150	\N	\N	2026-04-22 14:10:53.88+01	2026-04-22 14:10:53.88+01	2
29	SC16ML-1D70	270567100	0.80	\N	6.35	≥ 90	\N	\N	2026-04-22 14:10:53.881+01	2026-04-22 14:10:53.881+01	2
30	SC16ML-1D70	270567100	1.50	\N	6.35	≥ 150	\N	\N	2026-04-22 14:10:53.882+01	2026-04-22 14:10:53.882+01	2
31	SC16M-1S31	270567111	0.80	\N	6.35	≥ 90	\N	\N	2026-04-22 14:10:53.883+01	2026-04-22 14:10:53.883+01	2
32	SC16M-1S31	270567111	1.50	\N	6.35	≥ 150	\N	\N	2026-04-22 14:10:53.885+01	2026-04-22 14:10:53.885+01	2
33	SC14M1TK6	270612180	2.00	\N	6.35	≥ 200	\N	cosse -50 pieces	2026-04-22 14:10:53.888+01	2026-04-22 14:10:53.888+01	2
34	39-00-0040	270614470	0.20	\N	3 à 3,3	≥ 29	\N	\N	2026-04-22 14:10:53.89+01	2026-04-22 14:10:53.89+01	2
35	39-00-0040	270614470	0.34	\N	3 à 3,3	≥ 39	\N	\N	2026-04-22 14:10:53.891+01	2026-04-22 14:10:53.891+01	2
36	39-00-0040	270614470	0.50	\N	3 à 3,3	≥ 59	\N	\N	2026-04-22 14:10:53.893+01	2026-04-22 14:10:53.893+01	2
37	39-00-0040	270614470	0.75	\N	3 à 3,3	≥ 88	\N	\N	2026-04-22 14:10:53.894+01	2026-04-22 14:10:53.894+01	2
38	39-00-0038	270600600	0.20	\N	3 à 3,3	≥ 29	\N	\N	2026-04-22 14:10:53.895+01	2026-04-22 14:10:53.895+01	2
39	39-00-0038	270600600	0.34	\N	3 à 3,3	≥ 39	\N	\N	2026-04-22 14:10:53.896+01	2026-04-22 14:10:53.896+01	2
40	39-00-0038	270600600	0.50	\N	3 à 3,3	≥ 59	\N	\N	2026-04-22 14:10:53.897+01	2026-04-22 14:10:53.897+01	2
41	39-00-0038	270600600	0.75	\N	3 à 3,3	≥ 88	\N	\N	2026-04-22 14:10:53.898+01	2026-04-22 14:10:53.898+01	2
42	SM14M1TK6	270612660	2.00	\N	6.35	\N	\N	\N	2026-04-22 14:10:53.898+01	2026-04-22 14:10:53.898+01	2
43	CAR2PC68	270609270	6.00	\N	12	≥ 650	\N	cosse 270609280 -50 pieces	2026-04-22 14:10:53.903+01	2026-04-22 14:10:53.903+01	3
44	CAR2PC68	270609280	\N	\N	12	≥ 650	\N	\N	2026-04-22 14:10:53.904+01	2026-04-22 14:10:53.904+01	3
45	CAR2PC68	270567101	\N	\N	12	≥ 650	\N	\N	2026-04-22 14:10:53.905+01	2026-04-22 14:10:53.905+01	3
46	DARS24296-000A3	270611240	\N	\N	12	≥ 650	\N	cosse 270611250 -50 pieces	2026-04-22 14:10:53.905+01	2026-04-22 14:10:53.905+01	3
47	DARS24296-000A3	270611250	\N	\N	12	≥ 650	\N	\N	2026-04-22 14:10:53.906+01	2026-04-22 14:10:53.906+01	3
48	770854-1	270600650	0.50	\N	5.1	80	\N	\N	2026-04-22 14:10:53.912+01	2026-04-22 14:10:53.912+01	4
49	770854-1	270600650	0.75	\N	5.1	90	\N	\N	2026-04-22 14:10:53.914+01	2026-04-22 14:10:53.914+01	4
50	770854-1	270600650	1.00	\N	5.1	108	\N	\N	2026-04-22 14:10:53.917+01	2026-04-22 14:10:53.917+01	4
51	770854-1	270600650	1.50	\N	5.1	150	\N	\N	2026-04-22 14:10:53.918+01	2026-04-22 14:10:53.918+01	4
52	0460-202-20141	270640000	0.50	\N	3,96 à 5,54	≥ 89	\N	\N	2026-04-22 14:10:53.922+01	2026-04-22 14:10:53.922+01	5
53	0462-201-16141	270567026	1.50	\N	6,35 à 7,92	≥ 156	\N	\N	2026-04-22 14:10:53.924+01	2026-04-22 14:10:53.924+01	5
54	0462-201-16141	270567026	1.00	\N	6,35 à 7,92	≥ 156	\N	\N	2026-04-22 14:10:53.927+01	2026-04-22 14:10:53.927+01	5
55	0462-201-16141	270567026	0.75	\N	6,35 à 7,92	≥ 111	\N	\N	2026-04-22 14:10:53.928+01	2026-04-22 14:10:53.928+01	5
56	0462-201-16141	270567026	0.50	\N	6,35 à 7,92	≥ 89	\N	\N	2026-04-22 14:10:53.93+01	2026-04-22 14:10:53.93+01	5
57	0462-201-16141	270567069	1.50	\N	6,35 à 7,92	≥ 156	\N	cosse -50 pieces	2026-04-22 14:10:53.932+01	2026-04-22 14:10:53.932+01	5
58	0462-201-16141	270567069	1.00	\N	6,35 à 7,92	≥ 156	\N	\N	2026-04-22 14:10:53.933+01	2026-04-22 14:10:53.933+01	5
59	0462-201-16141	270567069	0.75	\N	6,35 à 7,92	≥ 111	\N	\N	2026-04-22 14:10:53.934+01	2026-04-22 14:10:53.934+01	5
60	0462-201-16141	270567069	0.50	\N	6,35 à 7,92	≥ 89	\N	\N	2026-04-22 14:10:53.935+01	2026-04-22 14:10:53.935+01	5
61	0462-203-12141	270567075	3.00	\N	5,64 à 7,21	≥ 334	\N	\N	2026-04-22 14:10:53.936+01	2026-04-22 14:10:53.936+01	5
62	0462-203-12141	270567075	2.00	\N	5,64 à 7,21	≥ 311	\N	\N	2026-04-22 14:10:53.938+01	2026-04-22 14:10:53.938+01	5
63	0462-203-12141	270567078	3.00	\N	5,64 à 7,21	≥ 334	\N	\N	2026-04-22 14:10:53.94+01	2026-04-22 14:10:53.94+01	5
64	0462-203-12141	270567078	2.00	\N	5,64 à 7,21	≥ 311	\N	\N	2026-04-22 14:10:53.941+01	2026-04-22 14:10:53.941+01	5
65	0462-201-20141	270610710	0.50	\N	3,96 à 5,54	≥ 89	\N	manque cosse	2026-04-22 14:10:53.943+01	2026-04-22 14:10:53.943+01	5
66	0460-215-16141	270606300	2.00	\N	6,35 à 7,92	≥ 311	\N	\N	2026-04-22 14:10:53.944+01	2026-04-22 14:10:53.944+01	5
67	0460-215-16141	270600850	\N	\N	6,35 à 7,92	≥ 311	\N	\N	2026-04-22 14:10:53.945+01	2026-04-22 14:10:53.945+01	5
68	12048074	270599000	0.50	\N	4 à 4,5	≥ 75	\N	\N	2026-04-22 14:10:53.948+01	2026-04-22 14:10:53.948+01	6
69	12048074	270599000	0.75	\N	4 à 4,5	≥ 120	\N	\N	2026-04-22 14:10:53.949+01	2026-04-22 14:10:53.949+01	6
70	12048074	270599000	1.00	\N	4 à 4,5	≥ 160	\N	\N	2026-04-22 14:10:53.95+01	2026-04-22 14:10:53.95+01	6
71	12084200	270567114	0.30	\N	4 à 4,5	≥ 40	\N	\N	2026-04-22 14:10:53.951+01	2026-04-22 14:10:53.951+01	6
72	12084200	270567114	0.50	\N	4 à 4,5	≥ 60	\N	\N	2026-04-22 14:10:53.952+01	2026-04-22 14:10:53.952+01	6
73	929940-1	270567027	0.50	\N	4,3 à 5	≥ 60	\N	\N	2026-04-22 14:10:53.953+01	2026-04-22 14:10:53.953+01	6
74	929940-1	270567027	0.75	\N	4,3 à 5	≥ 85	\N	\N	2026-04-22 14:10:53.955+01	2026-04-22 14:10:53.955+01	6
75	929940-1	270567027	1.00	\N	4,3 à 5	≥ 100	\N	\N	2026-04-22 14:10:53.959+01	2026-04-22 14:10:53.959+01	6
76	929939-3	270621030	0.50	\N	4,3 à 5	≥ 60	\N	\N	2026-04-22 14:10:53.96+01	2026-04-22 14:10:53.96+01	6
77	929939-3	270621030	0.75	\N	4,3 à 5	≥ 85	\N	\N	2026-04-22 14:10:53.961+01	2026-04-22 14:10:53.961+01	6
78	929939-3	270621030	1.00	\N	4,3 à 5	≥ 100	\N	\N	2026-04-22 14:10:53.962+01	2026-04-22 14:10:53.962+01	6
79	927771-3	270614120	0.50	\N	3,7 à 4,3	≥ 60	\N	\N	2026-04-22 14:10:53.962+01	2026-04-22 14:10:53.962+01	6
80	927771-3	270614120	0.75	\N	3,7 à 4,3	≥ 85	\N	\N	2026-04-22 14:10:53.963+01	2026-04-22 14:10:53.963+01	6
81	927771-3	270614120	1.00	\N	3,7 à 4,3	≥ 100	\N	\N	2026-04-22 14:10:53.964+01	2026-04-22 14:10:53.964+01	6
82	927768-3	270621120	1.50	\N	4 à 4,6	≥ 150	\N	\N	2026-04-22 14:10:53.965+01	2026-04-22 14:10:53.965+01	6
83	927768-3	270621120	2.00	\N	4 à 4,6	≥ 200	\N	\N	2026-04-22 14:10:53.966+01	2026-04-22 14:10:53.966+01	6
84	927768-3	270621120	2.50	\N	4 à 4,6	≥ 200	\N	\N	2026-04-22 14:10:53.967+01	2026-04-22 14:10:53.967+01	6
85	929938-1	270567720	1.50	\N	4,9 à 5,5	≥ 150	\N	\N	2026-04-22 14:10:53.968+01	2026-04-22 14:10:53.968+01	6
86	929938-1	270567720	2.00	\N	4,9 à 5,5	≥ 200	\N	\N	2026-04-22 14:10:53.97+01	2026-04-22 14:10:53.97+01	6
87	929938-1	270567720	2.50	\N	4,9 à 5,5	≥ 200	\N	\N	2026-04-22 14:10:53.971+01	2026-04-22 14:10:53.971+01	6
88	1-929939-1	270612730	0.50	\N	4,3 à 5	≥ 60	\N	manque cosse	2026-04-22 14:10:53.973+01	2026-04-22 14:10:53.973+01	6
89	1-929939-1	270612730	0.75	\N	4,3 à 5	≥ 85	\N	\N	2026-04-22 14:10:53.975+01	2026-04-22 14:10:53.975+01	6
90	1-929939-1	270612730	1.00	\N	4,3 à 5	≥ 100	\N	\N	2026-04-22 14:10:53.976+01	2026-04-22 14:10:53.976+01	6
91	1-965982-1	270616740	0.20	\N	3,7 à 4,3	≥ 30	\N	cosse -50 pieces	2026-04-22 14:10:53.977+01	2026-04-22 14:10:53.977+01	6
92	1-965982-1	270616740	0.35	\N	3,7 à 4,3	≥ 50	\N	\N	2026-04-22 14:10:53.978+01	2026-04-22 14:10:53.978+01	6
93	1-965982-1	270616740	0.50	\N	3,7 à 4,3	≥ 60	\N	\N	2026-04-22 14:10:53.979+01	2026-04-22 14:10:53.979+01	6
94	12089188	270600550	0.50	\N	4.5	≥ 75	\N	\N	2026-04-22 14:10:53.982+01	2026-04-22 14:10:53.982+01	7
95	12089188	270600550	0.75	\N	4.5	≥ 90	\N	\N	2026-04-22 14:10:53.983+01	2026-04-22 14:10:53.983+01	7
96	12089040	270600460	0.50	\N	4.5	≥ 75	\N	\N	2026-04-22 14:10:53.984+01	2026-04-22 14:10:53.984+01	7
97	12089040	270600460	0.75	\N	4.5	≥ 90	\N	\N	2026-04-22 14:10:53.986+01	2026-04-22 14:10:53.986+01	7
98	12124580	270600560	1.00	\N	4.5	≥ 120	\N	cosse -50 pieces	2026-04-22 14:10:53.988+01	2026-04-22 14:10:53.988+01	7
99	12124580	270600560	1.50	\N	4.5	≥ 150	\N	\N	2026-04-22 14:10:53.989+01	2026-04-22 14:10:53.989+01	7
100	12124580	270600560	2.00	\N	4.5	≥ 200	\N	\N	2026-04-22 14:10:53.99+01	2026-04-22 14:10:53.99+01	7
101	12124582	270600480	1.00	\N	4.5	≥ 120	\N	\N	2026-04-22 14:10:53.992+01	2026-04-22 14:10:53.992+01	7
102	12124582	270600480	1.50	\N	4.5	150	\N	\N	2026-04-22 14:10:53.995+01	2026-04-22 14:10:53.995+01	7
103	12124582	270600480	2.00	\N	4.5	200	\N	\N	2026-04-22 14:10:53.997+01	2026-04-22 14:10:53.997+01	7
104	MEC7190766	270607660	0.34	\N	4.5	≥ 60	\N	\N	2026-04-22 14:10:54.001+01	2026-04-22 14:10:54.001+01	8
105	MEC7190766	270607660	0.50	\N	4.5	≥ 95	\N	\N	2026-04-22 14:10:54.002+01	2026-04-22 14:10:54.002+01	8
106	MEC7190766	270607660	0.60	\N	4.5	≥ 100	\N	\N	2026-04-22 14:10:54.003+01	2026-04-22 14:10:54.003+01	8
107	MEC7190766	270607660	0.75	\N	4.5	≥ 120	\N	\N	2026-04-22 14:10:54.004+01	2026-04-22 14:10:54.004+01	8
108	MEC7190766	270607660	1.00	\N	4.5	≥ 140	\N	\N	2026-04-22 14:10:54.005+01	2026-04-22 14:10:54.005+01	8
109	MEC7190766	270607660	1.50	\N	4.5	≥ 190	\N	\N	2026-04-22 14:10:54.006+01	2026-04-22 14:10:54.006+01	8
110	9200180000	270608920	2.00	\N	4.5	≥ 192	\N	\N	2026-04-22 14:10:54.008+01	2026-04-22 14:10:54.008+01	8
111	9200260000	270608940	4.00	\N	4.5	≥310	\N	manque cosse	2026-04-22 14:10:54.01+01	2026-04-22 14:10:54.01+01	8
112	620/5E	M0211065012	0.50	\N	4.5	≥ 60	\N	\N	2026-04-22 14:10:54.014+01	2026-04-22 14:10:54.014+01	9
113	620/5E	M0211065012	0.75	\N	4.5	≥ 85	\N	\N	2026-04-22 14:10:54.016+01	2026-04-22 14:10:54.016+01	9
114	620/5E	M0211065012	1.00	\N	4.5	≥ 140	\N	\N	2026-04-22 14:10:54.018+01	2026-04-22 14:10:54.018+01	9
115	620/5E	M0211065012	1.50	\N	4.5	≥ 150	\N	\N	2026-04-22 14:10:54.02+01	2026-04-22 14:10:54.02+01	9
116	9200260000	270608940	1.50	\N	4.5	≥ 150	\N	\N	2026-04-22 14:10:54.022+01	2026-04-22 14:10:54.022+01	9
117	9200260000	270608940	2.00	\N	4.5	≥ 192	\N	\N	2026-04-22 14:10:54.024+01	2026-04-22 14:10:54.024+01	9
118	9200260000	270608940	2.50	\N	4.5	≥ 230	\N	\N	2026-04-22 14:10:54.027+01	2026-04-22 14:10:54.027+01	9
119	9200180000	270608920	4.00	\N	4.5	≥310	\N	manque cosse	2026-04-22 14:10:54.029+01	2026-04-22 14:10:54.029+01	9
120	\N	Pince sertissage embout cablage 6, 10 et 16mm²	\N	\N	\N	\N	\N	verefication visuelle	2026-04-22 14:10:54.034+01	2026-04-22 14:10:54.034+01	11
121	\N	Pince sertissage embout cablage 6, 10 et 16mm²	\N	\N	\N	\N	\N	verefication visuelle	2026-04-22 14:10:54.037+01	2026-04-22 14:10:54.037+01	12
122	\N	Pince sertissage embout cablage 0,14 à 6mm²	\N	\N	\N	\N	\N	verefication visuelle	2026-04-22 14:10:54.04+01	2026-04-22 14:10:54.04+01	13
123	39-00-0038	270600600	0.20	\N	3 à 3,3	≥ 29	\N	cosse -50 pieces	2026-04-22 14:10:54.046+01	2026-04-22 14:10:54.046+01	15
124	39-00-0038	270600600	0.34	\N	3 à 3,3	≥ 39	\N	\N	2026-04-22 14:10:54.047+01	2026-04-22 14:10:54.047+01	15
125	39-00-0038	270600600	0.50	\N	3 à 3,3	≥ 59	\N	\N	2026-04-22 14:10:54.048+01	2026-04-22 14:10:54.048+01	15
126	39-00-0038	270600600	0.75	\N	3 à 3,3	≥ 88	\N	\N	2026-04-22 14:10:54.05+01	2026-04-22 14:10:54.05+01	15
127	39-00-0040	270614470	0.20	\N	3 à 3,3	≥ 29	\N	\N	2026-04-22 14:10:54.052+01	2026-04-22 14:10:54.052+01	15
128	39-00-0040	270614470	0.34	\N	3 à 3,5	≥ 39	\N	\N	2026-04-22 14:10:54.052+01	2026-04-22 14:10:54.052+01	15
129	39-00-0040	270614470	0.50	\N	3 à 3,3	≥ 59	\N	\N	2026-04-22 14:10:54.053+01	2026-04-22 14:10:54.053+01	15
130	39-00-0040	270614470	0.75	\N	3 à 3,3	≥ 88	\N	\N	2026-04-22 14:10:54.054+01	2026-04-22 14:10:54.054+01	15
131	39-00-0077	270607530	1.50	\N	3 à 3,3	≥ 88	\N	cosse 270606970 -50 pieces	2026-04-22 14:10:54.055+01	2026-04-22 14:10:54.055+01	15
132	39-00-0078	270606970	1.50	\N	3 à 3,3	≥ 88	\N	\N	2026-04-22 14:10:54.056+01	2026-04-22 14:10:54.056+01	15
133	39-00-0081	270607540	1.50	\N	3 à 3,3	≥ 88	\N	\N	2026-04-22 14:10:54.059+01	2026-04-22 14:10:54.059+01	15
134	39-00-0082	270607030	1.50	\N	3 à 3,3	≥ 88	\N	\N	2026-04-22 14:10:54.06+01	2026-04-22 14:10:54.06+01	15
135	SWPR-001T-P025	270599760	0.35	\N	3 à 3,5	≥ 36	\N	TEC	2026-04-22 14:10:54.063+01	2026-04-22 14:10:54.063+01	16
136	SWPR-001T-P025	270599760	0.20	\N	3 à 3,5	≥ 22	\N	\N	2026-04-22 14:10:54.064+01	2026-04-22 14:10:54.064+01	16
137	SWPR-001T-P025	270599760	0.13	\N	3 à 3,5	≥ 13	\N	\N	2026-04-22 14:10:54.065+01	2026-04-22 14:10:54.065+01	16
138	SWPR-001T-P025	270599790	0.35	\N	3 à 3,5	≥ 36	\N	\N	2026-04-22 14:10:54.066+01	2026-04-22 14:10:54.066+01	16
139	SWPR-001T-P025	270599790	0.20	\N	3 à 3,5	≥ 22	\N	\N	2026-04-22 14:10:54.067+01	2026-04-22 14:10:54.067+01	16
140	SWPR-001T-P025	270599790	0.13	\N	3 à 3,5	≥ 13	\N	\N	2026-04-22 14:10:54.067+01	2026-04-22 14:10:54.067+01	16
141	CAR2PC68	270609270	6.00	\N	12	≥ 650	\N	\N	2026-04-22 14:10:54.07+01	2026-04-22 14:10:54.07+01	17
142	CAR2PC68	270609280	6.00	\N	12	≥ 650	\N	\N	2026-04-22 14:10:54.071+01	2026-04-22 14:10:54.071+01	17
143	CAR3PC68	270567101	6.00	\N	12	≥ 650	\N	\N	2026-04-22 14:10:54.072+01	2026-04-22 14:10:54.072+01	17
144	DARS24296-000A3	270611240	6.00	\N	12	≥ 650	\N	\N	2026-04-22 14:10:54.073+01	2026-04-22 14:10:54.073+01	17
145	DARS24263-000A3	270611250	6.00	\N	12	≥ 650	\N	cosse -50 pieces	2026-04-22 14:10:54.074+01	2026-04-22 14:10:54.074+01	17
146	0462-203-04141	270613240	13.00	\N	10,92 à 12,50	≥ 1334	\N	\N	2026-04-22 14:10:54.076+01	2026-04-22 14:10:54.076+01	17
147	0460-204-0490	270613140	13.00	\N	10,92 à 12,50	≥ 1330	\N	\N	2026-04-22 14:10:54.077+01	2026-04-22 14:10:54.077+01	17
148	0462-203-08141	270567074	5.00	\N	10,92 à 12,50	≥ 400	\N	\N	2026-04-22 14:10:54.078+01	2026-04-22 14:10:54.078+01	17
149	0462-203-08141	270567074	8.00	\N	10,92 à 12,50	≥ 556	\N	\N	2026-04-22 14:10:54.079+01	2026-04-22 14:10:54.079+01	17
150	0460-204-08141	270567046	5.00	\N	10,92 à 12,50	≥ 400	\N	\N	2026-04-22 14:10:54.08+01	2026-04-22 14:10:54.08+01	17
151	0460-204-08141	270567046	8.00	\N	10,92 à 12,50	≥ 556	\N	\N	2026-04-22 14:10:54.081+01	2026-04-22 14:10:54.081+01	17
152	282403-1	270567021	0.35	\N	3 à 3,5	≥ 60	\N	\N	2026-04-22 14:10:54.083+01	2026-04-22 14:10:54.083+01	18
153	282403-1	270567021	0.50	\N	3 à 3,5	≥ 70	\N	\N	2026-04-22 14:10:54.085+01	2026-04-22 14:10:54.085+01	18
154	183035-1	270567020	0.35	\N	3 à 3,5	≥ 60	\N	\N	2026-04-22 14:10:54.085+01	2026-04-22 14:10:54.085+01	18
155	183035-1	270567020	0.50	\N	3 à 3,5	≥ 70	\N	\N	2026-04-22 14:10:54.086+01	2026-04-22 14:10:54.086+01	18
156	282404-1	270567011	0.35	\N	3 à 3,5	≥ 60	\N	\N	2026-04-22 14:10:54.087+01	2026-04-22 14:10:54.087+01	18
157	282404-1	270567011	0.50	\N	3 à 3,5	≥ 70	\N	\N	2026-04-22 14:10:54.088+01	2026-04-22 14:10:54.088+01	18
158	183036-1	270567010	0.35	\N	3 à 3,5	≥ 60	\N	cosse -50 pieces	2026-04-22 14:10:54.089+01	2026-04-22 14:10:54.089+01	18
159	183036-1	270567010	20.00	\N	3 à 3,5	≥ 70	\N	\N	2026-04-22 14:10:54.091+01	2026-04-22 14:10:54.091+01	18
160	282110-1	923919100	0.75	\N	3 à 3,5	≥ 85	\N	\N	2026-04-22 14:10:54.092+01	2026-04-22 14:10:54.092+01	18
161	282110-1	923919100	1.00	\N	3 à 3,5	≥ 108	\N	\N	2026-04-22 14:10:54.093+01	2026-04-22 14:10:54.093+01	18
162	282110-1	923919100	1.50	\N	3 à 3,5	≥ 150	\N	\N	2026-04-22 14:10:54.094+01	2026-04-22 14:10:54.094+01	18
163	183025-1	923919000	0.75	\N	3 à 3,5	≥ 85	\N	\N	2026-04-22 14:10:54.095+01	2026-04-22 14:10:54.095+01	18
164	183025-1	923919000	1.00	\N	3 à 3,5	≥ 115	\N	\N	2026-04-22 14:10:54.096+01	2026-04-22 14:10:54.096+01	18
165	183025-1	923919000	1.50	\N	3 à 3,5	≥ 155	\N	\N	2026-04-22 14:10:54.098+01	2026-04-22 14:10:54.098+01	19
166	282109-1	923921000	0.75	\N	3 à 3,5	≥ 85	\N	\N	2026-04-22 14:10:54.099+01	2026-04-22 14:10:54.099+01	19
167	282109-1	923921000	1.00	\N	3 à 3,5	≥ 115	\N	\N	2026-04-22 14:10:54.1+01	2026-04-22 14:10:54.1+01	19
168	282109-1	923921000	1.50	\N	3 à 3,5	≥ 155	\N	\N	2026-04-22 14:10:54.101+01	2026-04-22 14:10:54.101+01	19
169	183024-1	923920000	0.75	\N	3 à 3,5	≥ 85	\N	\N	2026-04-22 14:10:54.102+01	2026-04-22 14:10:54.102+01	19
170	183024-1	923920000	1.00	\N	3 à 3,5	≥ 115	\N	\N	2026-04-22 14:10:54.103+01	2026-04-22 14:10:54.103+01	19
171	183024-1	923920000	1.50	\N	3 à 3,5	≥ 155	\N	\N	2026-04-22 14:10:54.103+01	2026-04-22 14:10:54.103+01	19
172	282466-1	270567128	1.50	\N	3,5 à 4	≥ 155	\N	\N	2026-04-22 14:10:54.104+01	2026-04-22 14:10:54.104+01	19
173	282466-1	270567128	2.50	\N	3,5 à 4	≥ 230	\N	\N	2026-04-22 14:10:54.105+01	2026-04-22 14:10:54.105+01	19
174	282465-1	270599190	1.50	\N	3,5 à 4	≥ 155	\N	\N	2026-04-22 14:10:54.107+01	2026-04-22 14:10:54.107+01	19
175	282465-1	270599190	2.50	\N	3,5 à 4	≥ 230	\N	\N	2026-04-22 14:10:54.108+01	2026-04-22 14:10:54.108+01	19
176	82913607A	270606840	6.00	\N	6,5 - 7,5	≥360	\N	cosse -50 pieces	2026-04-22 14:10:54.111+01	2026-04-22 14:10:54.111+01	20
177	193990-2	270606810	6.00	\N	9.5	≥360	\N	cosse 270606810- 50 pieces	2026-04-22 14:10:54.114+01	2026-04-22 14:10:54.114+01	21
178	193991-4	270606740	6.00	\N	9.5	≥360	\N	\N	2026-04-22 14:10:54.115+01	2026-04-22 14:10:54.115+01	21
179	SC16M-1S31	270567111	0.80	\N	6.35	≥ 90	\N	\N	2026-04-22 14:10:54.117+01	2026-04-22 14:10:54.117+01	22
180	SC16M-1S31	270567111	1.50	\N	6.35	≥ 150	\N	\N	2026-04-22 14:10:54.118+01	2026-04-22 14:10:54.118+01	22
181	SC16ML-1D70	270567100	0.80	\N	6.35	≥ 90	\N	cosse -50 pieces	2026-04-22 14:10:54.119+01	2026-04-22 14:10:54.119+01	22
182	SC16ML-1D70	270567100	1.50	\N	6.35	≥ 150	\N	\N	2026-04-22 14:10:54.12+01	2026-04-22 14:10:54.12+01	22
183	SM16M-1S31	270567081	0.80	\N	6.35	≥ 90	\N	\N	2026-04-22 14:10:54.121+01	2026-04-22 14:10:54.121+01	22
184	SM16M-1S31	270567081	1.50	\N	6.35	≥ 150	\N	\N	2026-04-22 14:10:54.123+01	2026-04-22 14:10:54.123+01	22
185	SM16ML-1D70	270567080	0.80	\N	6.35	≥ 90	\N	\N	2026-04-22 14:10:54.125+01	2026-04-22 14:10:54.125+01	22
186	SM16ML-1D70	270567080	1.50	\N	6.35	≥ 150	\N	\N	2026-04-22 14:10:54.127+01	2026-04-22 14:10:54.127+01	22
187	SC14M1TK6	270612180	2.00	\N	6.35	≥200	\N	cosse -50 pieces	2026-04-22 14:10:54.128+01	2026-04-22 14:10:54.128+01	22
188	SC14M1TK6	270612660	2.00	\N	6.35	\N	\N	\N	2026-04-22 14:10:54.129+01	2026-04-22 14:10:54.129+01	22
189	0462-203-12141	270567075	3.00	\N	5,64 à 7,21	≥ 334	\N	\N	2026-04-22 14:10:54.132+01	2026-04-22 14:10:54.132+01	23
190	0462-203-12141	270567075	2.00	\N	5,64 à 7,21	≥ 311	\N	\N	2026-04-22 14:10:54.133+01	2026-04-22 14:10:54.133+01	23
191	0460-204-12141	270567078	3.00	\N	5,64 à 7,21	≥ 334	\N	\N	2026-04-22 14:10:54.134+01	2026-04-22 14:10:54.134+01	23
192	0460-204-12141	270567078	2.00	\N	5,64 à 7,21	≥ 311	\N	\N	2026-04-22 14:10:54.135+01	2026-04-22 14:10:54.135+01	23
193	0462-201-16141	270567026	1.50	\N	6,35 à 7,92	≥ 156	\N	manque cosse	2026-04-22 14:10:54.136+01	2026-04-22 14:10:54.136+01	23
194	0462-201-16141	270567026	1.00	\N	6,35 à 7,92	≥ 108	\N	\N	2026-04-22 14:10:54.137+01	2026-04-22 14:10:54.137+01	23
195	0462-201-16141	270567026	0.75	\N	6,35 à 7,92	≥ 85	\N	\N	2026-04-22 14:10:54.138+01	2026-04-22 14:10:54.138+01	23
196	0462-201-16141	270567026	0.50	\N	6,35 à 7,92	≥ 60	\N	\N	2026-04-22 14:10:54.139+01	2026-04-22 14:10:54.139+01	23
197	0460-202-16141	270567069	1.50	\N	6,35 à 7,92	≥ 156	\N	cosse -50 pieces	2026-04-22 14:10:54.14+01	2026-04-22 14:10:54.14+01	23
198	0460-202-16141	270567069	1.00	\N	6,35 à 7,92	≥ 108	\N	\N	2026-04-22 14:10:54.141+01	2026-04-22 14:10:54.141+01	23
199	0460-202-16141	270567069	0.75	\N	6,35 à 7,92	≥ 111	\N	\N	2026-04-22 14:10:54.143+01	2026-04-22 14:10:54.143+01	23
200	0460-202-16141	270567069	0.50	\N	6,35 à 7,92	≥ 60	\N	\N	2026-04-22 14:10:54.145+01	2026-04-22 14:10:54.145+01	23
201	0462-209-16141	270600850	2.00	\N	6,35 à 7,92	≥ 311	\N	\N	2026-04-22 14:10:54.146+01	2026-04-22 14:10:54.146+01	23
202	0460-215-16141	270606300	2.00	\N	6,35 à 7,92	≥ 311	\N	\N	2026-04-22 14:10:54.147+01	2026-04-22 14:10:54.147+01	23
203	0462-201-20141	270610710	0.50	\N	3,96 à 5,54	≥ 89	\N	270610710 cosse manquer	2026-04-22 14:10:54.148+01	2026-04-22 14:10:54.148+01	23
204	0460-202-20141	270640000	0.50	\N	3,96 à 5,54	≥ 89	\N	\N	2026-04-22 14:10:54.149+01	2026-04-22 14:10:54.149+01	23
205	61-0897-139	270567610	0.50	\N	8.2	≥60	\N	\N	2026-04-22 14:10:54.152+01	2026-04-22 14:10:54.152+01	24
206	61-0892-139	270599170	0.50	\N	8.2	\N	\N	\N	2026-04-22 14:10:54.153+01	2026-04-22 14:10:54.153+01	24
207	61-0898-139	270567620	0.75	\N	8.2	≥85	\N	\N	2026-04-22 14:10:54.154+01	2026-04-22 14:10:54.154+01	24
208	61-0898-139	270567620	1.00	\N	8.2	≥108	\N	\N	2026-04-22 14:10:54.155+01	2026-04-22 14:10:54.155+01	24
209	61-0893-139	270608480	0.75	\N	8.2	≥75	\N	\N	2026-04-22 14:10:54.156+01	2026-04-22 14:10:54.156+01	24
210	61-0893-139	270608480	1.00	\N	8.2	≥108	\N	\N	2026-04-22 14:10:54.158+01	2026-04-22 14:10:54.158+01	24
211	61-0899-139	270599130	1.50	\N	8.2	≥150	\N	\N	2026-04-22 14:10:54.159+01	2026-04-22 14:10:54.159+01	24
212	61-0894-139	270599160	1.50	\N	8.2	\N	\N	cosse -50 pieces	2026-04-22 14:10:54.16+01	2026-04-22 14:10:54.16+01	24
213	61-0900-139	270608150	2.50	\N	8	≥230	\N	manque cosse	2026-04-22 14:10:54.161+01	2026-04-22 14:10:54.161+01	24
214	61-0902-139	270608130	2.50	\N	8	\N	\N	\N	2026-04-22 14:10:54.162+01	2026-04-22 14:10:54.162+01	24
215	4250000872	270567042	0.50	\N	4.5	≥ 60	\N	\N	2026-04-22 14:10:54.165+01	2026-04-22 14:10:54.165+01	25
216	4250000872	270567042	0.50	\N	4.5	\N	\N	\N	2026-04-22 14:10:54.167+01	2026-04-22 14:10:54.167+01	25
217	4250000872	270567042	0.80	\N	4.5	≥ 85	\N	\N	2026-04-22 14:10:54.169+01	2026-04-22 14:10:54.169+01	25
218	4250000872	270567042	0.80	\N	4.5	\N	\N	\N	2026-04-22 14:10:54.17+01	2026-04-22 14:10:54.17+01	25
219	4250000872	270567042	1.00	\N	4.5	≥ 108	\N	\N	2026-04-22 14:10:54.172+01	2026-04-22 14:10:54.172+01	25
220	4250000872	270567042	1.00	\N	4.5	\N	\N	\N	2026-04-22 14:10:54.176+01	2026-04-22 14:10:54.176+01	25
221	4250000873	270567043	0.75	\N	4.5	≥ 85	\N	manque cosse	2026-04-22 14:10:54.183+01	2026-04-22 14:10:54.183+01	26
222	4250000873	270567043	1.00	\N	4.5	≥ 108	\N	\N	2026-04-22 14:10:54.185+01	2026-04-22 14:10:54.185+01	26
223	4250000873	270567043	2.00	\N	4.5	≥ 200	\N	\N	2026-04-22 14:10:54.187+01	2026-04-22 14:10:54.187+01	26
224	926882-1	270567570	0.50	\N	3,99 à 4,75	≥ 58	\N	\N	2026-04-22 14:10:54.192+01	2026-04-22 14:10:54.192+01	27
225	926882-1	270567570	0.80	\N	3,99 à 4,75	≥ 89	\N	\N	2026-04-22 14:10:54.193+01	2026-04-22 14:10:54.193+01	27
226	926882-1	270567570	1.30	\N	3,99 à 4,75	≥ 134	\N	\N	2026-04-22 14:10:54.194+01	2026-04-22 14:10:54.194+01	27
227	926882-1	270567570	2.10	\N	3,99 à 4,75	≥ 223	\N	\N	2026-04-22 14:10:54.195+01	2026-04-22 14:10:54.195+01	27
228	926893-1	270569970	0.50	\N	3,99 à 4,75	≥ 58	\N	manque cosse	2026-04-22 14:10:54.196+01	2026-04-22 14:10:54.196+01	27
229	350550-1	270607790	0.50	\N	3,99 à 4,75	≥ 58	\N	\N	2026-04-22 14:10:54.197+01	2026-04-22 14:10:54.197+01	27
230	350550-1	270607790	0.80	\N	3,99 à 4,75	≥ 89	\N	\N	2026-04-22 14:10:54.198+01	2026-04-22 14:10:54.198+01	27
231	350550-1	270607790	1.30	\N	3,99 à 4,75	≥ 134	\N	\N	2026-04-22 14:10:54.203+01	2026-04-22 14:10:54.203+01	27
232	350550-1	270607790	2.10	\N	3,99 à 4,75	≥ 223	\N	\N	2026-04-22 14:10:54.205+01	2026-04-22 14:10:54.205+01	27
233	350705-1	270599980	0.50	\N	3,99 à 4,75	≥ 58	\N	cosse -50 pieces	2026-04-22 14:10:54.207+01	2026-04-22 14:10:54.207+01	27
234	350705-1	270599980	0.80	\N	3,99 à 4,75	≥ 89	\N	\N	2026-04-22 14:10:54.209+01	2026-04-22 14:10:54.209+01	27
235	350705-1	270599980	1.30	\N	3,99 à 4,75	≥ 134	\N	\N	2026-04-22 14:10:54.211+01	2026-04-22 14:10:54.211+01	27
236	350705-1	270599980	2.10	\N	3,99 à 4,75	≥ 223	\N	\N	2026-04-22 14:10:54.212+01	2026-04-22 14:10:54.212+01	27
237	1-965982-1	270616740	0.20	\N	3,7 à 4,3	≥ 30	\N	cosse -50 pieces	2026-04-22 14:10:54.216+01	2026-04-22 14:10:54.216+01	28
238	1-965982-1	270616740	0.35	\N	3,7 à 4,3	≥ 50	\N	\N	2026-04-22 14:10:54.217+01	2026-04-22 14:10:54.217+01	28
239	1-965982-1	270616740	0.50	\N	3,7 à 4,3	≥ 60	\N	\N	2026-04-22 14:10:54.218+01	2026-04-22 14:10:54.218+01	28
240	927771-3	270614120	0.50	\N	3,7 à 4,3	≥ 60	\N	\N	2026-04-22 14:10:54.219+01	2026-04-22 14:10:54.219+01	28
241	927771-3	270614120	0.75	\N	3,7 à 4,3	85	\N	\N	2026-04-22 14:10:54.22+01	2026-04-22 14:10:54.22+01	28
242	927771-3	270614120	1.00	\N	3,7 à 4,3	≥ 100	\N	\N	2026-04-22 14:10:54.221+01	2026-04-22 14:10:54.221+01	28
243	927768-3	270621120	1.50	\N	4 à 4,6	≥ 150	\N	\N	2026-04-22 14:10:54.222+01	2026-04-22 14:10:54.222+01	28
244	927768-3	270621120	2.00	\N	4 à 4,6	≥200	\N	\N	2026-04-22 14:10:54.223+01	2026-04-22 14:10:54.223+01	28
245	927768-3	270621120	2.50	\N	4 à 4,6	≥ 230	\N	\N	2026-04-22 14:10:54.224+01	2026-04-22 14:10:54.224+01	28
246	929940-1	270567027	0.50	\N	4 à 4,6	≥ 60	\N	\N	2026-04-22 14:10:54.226+01	2026-04-22 14:10:54.226+01	28
247	929940-1	270567027	0.75	\N	4 à 4,6	≥85	\N	\N	2026-04-22 14:10:54.227+01	2026-04-22 14:10:54.227+01	28
248	929940-1	270567027	1.00	\N	4 à 4,6	≥ 100	\N	\N	2026-04-22 14:10:54.228+01	2026-04-22 14:10:54.228+01	28
249	929938-1	270567720	1.50	\N	4,9 à 5,5	≥ 150	\N	\N	2026-04-22 14:10:54.229+01	2026-04-22 14:10:54.229+01	28
250	929938-1	270567720	2.00	\N	4,9 à 5,5	≥200	\N	\N	2026-04-22 14:10:54.23+01	2026-04-22 14:10:54.23+01	28
251	929938-1	270567720	2.50	\N	4,9 à 5,5	≥ 200	\N	\N	2026-04-22 14:10:54.231+01	2026-04-22 14:10:54.231+01	28
252	1-929939-1	270612730	0.50	\N	4,3 à 5	≥ 60	\N	manque cosse	2026-04-22 14:10:54.232+01	2026-04-22 14:10:54.232+01	28
253	1-929939-1	270612730	0.75	\N	4,3 à 5	≥85	\N	\N	2026-04-22 14:10:54.233+01	2026-04-22 14:10:54.233+01	28
254	1-929939-1	270612730	1.00	\N	4,3 à 5	≥ 100	\N	\N	2026-04-22 14:10:54.235+01	2026-04-22 14:10:54.235+01	28
255	929939-3	270621030	0.50	\N	4,3 à 5	≥ 60	\N	\N	2026-04-22 14:10:54.236+01	2026-04-22 14:10:54.236+01	28
256	929939-3	270621030	0.75	\N	4,3 à 5	≥85	\N	\N	2026-04-22 14:10:54.237+01	2026-04-22 14:10:54.237+01	28
257	929939-3	270621030	1.00	\N	4,3 à 5	≥ 100	\N	\N	2026-04-22 14:10:54.238+01	2026-04-22 14:10:54.238+01	28
258	926893-1	270569970	0.80	\N	3,99 à 4,75	≥ 89	\N	\N	2026-04-22 14:10:54.239+01	2026-04-22 14:10:54.239+01	28
259	926893-1	270569970	1.30	\N	3,99 à 4,75	≥ 134	\N	\N	2026-04-22 14:10:54.244+01	2026-04-22 14:10:54.244+01	29
260	926893-1	270569970	2.10	\N	3,99 à 4,75	≥ 223	\N	manque cosse	2026-04-22 14:10:54.247+01	2026-04-22 14:10:54.247+01	30
261	172773-4	270608590	0.30	\N	3,5 - 5,5	≥ 49	\N	\N	2026-04-22 14:10:54.248+01	2026-04-22 14:10:54.248+01	30
262	172773-4	270608590	0.50	\N	3,5 - 5,5	≥ 88,3	\N	\N	2026-04-22 14:10:54.25+01	2026-04-22 14:10:54.25+01	30
263	172773-4	270608590	0.85	\N	3,5 - 5,5	≥ 127,3	\N	\N	2026-04-22 14:10:54.252+01	2026-04-22 14:10:54.252+01	30
264	172773-4	270608590	1.25	\N	3,5 - 5,5	≥ 176,5	\N	\N	2026-04-22 14:10:54.254+01	2026-04-22 14:10:54.254+01	30
265	172773-4	270608590	2.00	\N	3,5 - 5,5	≥ 264,8	\N	\N	2026-04-22 14:10:54.257+01	2026-04-22 14:10:54.257+01	30
266	1062-16-0122	270608760	0.75	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.262+01	2026-04-22 14:10:54.262+01	31
267	1062-16-0122	270608760	1.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.263+01	2026-04-22 14:10:54.263+01	31
268	1062-16-0122	270608760	1.50	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.264+01	2026-04-22 14:10:54.264+01	31
269	1062-16-0122	270608760	2.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.264+01	2026-04-22 14:10:54.264+01	31
270	1062-16-0988	270621780	0.75	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.265+01	2026-04-22 14:10:54.265+01	31
271	1062-16-0988	270621780	1.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.266+01	2026-04-22 14:10:54.266+01	31
272	1062-16-0988	270621780	1.50	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.267+01	2026-04-22 14:10:54.267+01	31
273	1062-16-0988	270621780	2.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.268+01	2026-04-22 14:10:54.268+01	31
274	1060-16-0122	270608560	0.75	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.268+01	2026-04-22 14:10:54.268+01	31
275	1060-16-0122	270608560	1.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.269+01	2026-04-22 14:10:54.269+01	31
276	1060-16-0122	270608560	1.50	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.27+01	2026-04-22 14:10:54.27+01	31
277	1060-16-0122	270608560	2.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.271+01	2026-04-22 14:10:54.271+01	31
278	1062-20-0122	270608830	0.35	\N	3,81 à 5,08	≥ 45	\N	\N	2026-04-22 14:10:54.273+01	2026-04-22 14:10:54.273+01	32
279	1062-20-0122	270608830	0.50	\N	3,81 à 5,08	≥ 67	\N	\N	2026-04-22 14:10:54.274+01	2026-04-22 14:10:54.274+01	32
280	1062-20-0122	270608830	0.75	\N	3,81 à 5,08	≥ 89	\N	\N	2026-04-22 14:10:54.276+01	2026-04-22 14:10:54.276+01	32
281	1062-20-0122	270608830	1.00	\N	3,81 à 5,08	\N	\N	\N	2026-04-22 14:10:54.277+01	2026-04-22 14:10:54.277+01	32
282	1062-20-0122	270608830	1.50	\N	3,81 à 5,08	\N	\N	\N	2026-04-22 14:10:54.278+01	2026-04-22 14:10:54.278+01	32
283	1060-20-0122	270609950	0.35	\N	3,81 à 5,08	≥ 45	\N	\N	2026-04-22 14:10:54.278+01	2026-04-22 14:10:54.278+01	32
284	1060-20-0122	270609950	0.50	\N	3,81 à 5,08	≥ 67	\N	\N	2026-04-22 14:10:54.279+01	2026-04-22 14:10:54.279+01	32
285	1060-20-0122	270609950	0.75	\N	3,81 à 5,08	≥ 89	\N	\N	2026-04-22 14:10:54.28+01	2026-04-22 14:10:54.28+01	32
286	1060-20-0122	270609950	1.00	\N	3,81 à 5,08	\N	\N	\N	2026-04-22 14:10:54.281+01	2026-04-22 14:10:54.281+01	32
287	1060-20-0122	270609950	1.50	\N	3,81 à 5,08	\N	\N	\N	2026-04-22 14:10:54.281+01	2026-04-22 14:10:54.281+01	32
288	104479-8	270608640	0.20	\N	3,18 - 3,96	\N	\N	manque cosse	2026-04-22 14:10:54.284+01	2026-04-22 14:10:54.284+01	33
289	104479-8	270608640	0.35	\N	3,18 - 3,96	\N	\N	\N	2026-04-22 14:10:54.285+01	2026-04-22 14:10:54.285+01	33
290	104479-8	270608640	0.60	\N	3,18 - 3,96	\N	\N	\N	2026-04-22 14:10:54.286+01	2026-04-22 14:10:54.286+01	33
291	171662-1	270608610	0.50	\N	4 à 4,5	≥ 88,3	\N	\N	2026-04-22 14:10:54.288+01	2026-04-22 14:10:54.288+01	34
292	171662-1	270608610	0.85	\N	4 à 4,5	≥ 127,5	\N	\N	2026-04-22 14:10:54.291+01	2026-04-22 14:10:54.291+01	34
293	171662-1	270608610	1.40	\N	4 à 4,5	≥ 176,5	\N	\N	2026-04-22 14:10:54.295+01	2026-04-22 14:10:54.295+01	34
294	SC20ML1TK6	270609470	0.35	\N	4	≥ 40	\N	\N	2026-04-22 14:10:54.3+01	2026-04-22 14:10:54.3+01	35
295	SC20ML1TK6	270609470	0.50	\N	4	≥ 60	\N	\N	2026-04-22 14:10:54.302+01	2026-04-22 14:10:54.302+01	35
296	163088-1	270609030	0.20	\N	3,58 à 4,34	≥ 31	\N	\N	2026-04-22 14:10:54.305+01	2026-04-22 14:10:54.305+01	36
297	163088-1	270609030	0.35	\N	3,58 à 4,34	≥ 44	\N	\N	2026-04-22 14:10:54.306+01	2026-04-22 14:10:54.306+01	36
298	163088-1	270609030	0.50	\N	3,58 à 4,34	≥ 75	\N	\N	2026-04-22 14:10:54.309+01	2026-04-22 14:10:54.309+01	36
299	163086-1	270609050	0.20	\N	3,58 à 4,34	≥ 31	\N	\N	2026-04-22 14:10:54.311+01	2026-04-22 14:10:54.311+01	36
300	163086-1	270609050	0.35	\N	3,58 à 4,34	≥ 44	\N	\N	2026-04-22 14:10:54.312+01	2026-04-22 14:10:54.312+01	36
301	163086-1	270609050	0.50	\N	3,58 à 4,34	≥ 75	\N	\N	2026-04-22 14:10:54.312+01	2026-04-22 14:10:54.312+01	36
302	1-66100-9	270610410	0.75	\N	3,58 à 4,34	≥ 75	\N	\N	2026-04-22 14:10:54.313+01	2026-04-22 14:10:54.313+01	36
303	1-66100-9	270610410	1.00	\N	3,58 à 4,34	≥ 111	\N	\N	2026-04-22 14:10:54.314+01	2026-04-22 14:10:54.314+01	36
304	1-66100-9	270610410	1.50	\N	3,58 à 4,34	≥ 178	\N	\N	2026-04-22 14:10:54.315+01	2026-04-22 14:10:54.315+01	36
305	1-66101-9	270600340	0.75	\N	3,58 à 4,34	≥ 75	\N	\N	2026-04-22 14:10:54.316+01	2026-04-22 14:10:54.316+01	36
306	1-66101-9	270600340	1.00	\N	3,58 à 4,34	≥ 111	\N	\N	2026-04-22 14:10:54.316+01	2026-04-22 14:10:54.316+01	36
307	1-66101-9	270600340	1.50	\N	3,58 à 4,34	≥ 178	\N	\N	2026-04-22 14:10:54.317+01	2026-04-22 14:10:54.317+01	36
308	1-66098-8	270610400	0.75	\N	3,58 à 4,34	≥ 75	\N	\N	2026-04-22 14:10:54.318+01	2026-04-22 14:10:54.318+01	36
309	1-66098-8	270610400	1.00	\N	3,58 à 4,34	≥ 111	\N	\N	2026-04-22 14:10:54.319+01	2026-04-22 14:10:54.319+01	36
310	1-66098-8	270610400	1.50	\N	3,58 à 4,34	≥ 178	\N	\N	2026-04-22 14:10:54.32+01	2026-04-22 14:10:54.32+01	36
311	1-66099-5	270606710	0.75	\N	3,58 à 4,34	≥ 75	\N	\N	2026-04-22 14:10:54.32+01	2026-04-22 14:10:54.32+01	36
312	1-66099-5	270606710	1.00	\N	3,58 à 4,34	≥ 111	\N	\N	2026-04-22 14:10:54.322+01	2026-04-22 14:10:54.322+01	36
313	1-66099-5	270606710	1.50	\N	3,58 à 4,34	≥ 178	\N	\N	2026-04-22 14:10:54.326+01	2026-04-22 14:10:54.326+01	36
314	\N	270614750	0.34	\N	3.5	≥40	\N	\N	2026-04-22 14:10:54.332+01	2026-04-22 14:10:54.332+01	37
315	1062-16-0122	270608760	0.75	\N	3,5 à 5	≥ 85	\N	\N	2026-04-22 14:10:54.337+01	2026-04-22 14:10:54.337+01	38
316	1062-16-0122	270608760	1.00	\N	3,5 à 5	≥108	\N	\N	2026-04-22 14:10:54.338+01	2026-04-22 14:10:54.338+01	38
317	1062-16-0122	270608760	1.50	\N	3,5 à 5	≥ 150	\N	\N	2026-04-22 14:10:54.34+01	2026-04-22 14:10:54.34+01	38
318	1062-16-0122	270608760	2.00	\N	3,5 à 5	≥ 200	\N	\N	2026-04-22 14:10:54.341+01	2026-04-22 14:10:54.341+01	38
319	1062-16-0988	270621780	0.75	\N	3,5 à 5	≥ 85	\N	\N	2026-04-22 14:10:54.343+01	2026-04-22 14:10:54.343+01	38
320	1062-16-0988	270621780	1.00	\N	3,5 à 5	≥108	\N	\N	2026-04-22 14:10:54.344+01	2026-04-22 14:10:54.344+01	38
321	1062-16-0988	270621780	1.50	\N	3,5 à 5	≥ 150	\N	\N	2026-04-22 14:10:54.344+01	2026-04-22 14:10:54.344+01	38
322	1062-16-0988	270621780	2.00	\N	3,5 à 5	≥ 200	\N	\N	2026-04-22 14:10:54.345+01	2026-04-22 14:10:54.345+01	38
323	1060-16-0122	270608560	0.75	\N	3,5 à 5	≥ 85	\N	\N	2026-04-22 14:10:54.346+01	2026-04-22 14:10:54.346+01	38
324	1060-16-0122	270608560	1.00	\N	3,5 à 5	≥108	\N	\N	2026-04-22 14:10:54.347+01	2026-04-22 14:10:54.347+01	38
325	1060-16-0122	270608560	1.50	\N	3,5 à 5	≥ 150	\N	\N	2026-04-22 14:10:54.349+01	2026-04-22 14:10:54.349+01	38
326	1060-16-0122	270608560	2.00	\N	3,5 à 5	≥ 200	\N	\N	2026-04-22 14:10:54.35+01	2026-04-22 14:10:54.35+01	38
327	1062-20-0122	270608830	0.35	\N	3,5 à 5	≥ 45	\N	\N	2026-04-22 14:10:54.353+01	2026-04-22 14:10:54.353+01	39
328	1062-20-0122	270608830	0.50	\N	3,5 à 5	≥ 67	\N	\N	2026-04-22 14:10:54.355+01	2026-04-22 14:10:54.355+01	39
329	1062-20-0122	270608830	0.75	\N	3,5 à 5	≥ 89	\N	\N	2026-04-22 14:10:54.355+01	2026-04-22 14:10:54.355+01	39
330	1062-20-0122	270608830	1.00	\N	3,5 à 5	≥108	\N	\N	2026-04-22 14:10:54.357+01	2026-04-22 14:10:54.357+01	39
331	1062-20-0122	270608830	1.50	\N	3,5 à 5	≥150	\N	\N	2026-04-22 14:10:54.358+01	2026-04-22 14:10:54.358+01	39
332	1060-20-0122	270609950	0.35	\N	3,5 à 5	≥ 45	\N	\N	2026-04-22 14:10:54.36+01	2026-04-22 14:10:54.36+01	39
333	1060-20-0122	270609950	0.50	\N	3,5 à 5	≥ 67	\N	\N	2026-04-22 14:10:54.361+01	2026-04-22 14:10:54.361+01	39
334	1060-20-0122	270609950	0.75	\N	3,5 à 5	≥ 89	\N	\N	2026-04-22 14:10:54.363+01	2026-04-22 14:10:54.363+01	39
335	1060-20-0122	270609950	1.00	\N	3,5 à 5	≥108	\N	\N	2026-04-22 14:10:54.364+01	2026-04-22 14:10:54.364+01	39
336	1060-20-0122	270609950	1.50	\N	3,5 à 5	≥150	\N	\N	2026-04-22 14:10:54.365+01	2026-04-22 14:10:54.365+01	39
337	MEC7190766	270607660	0.34	\N	\N	≥ 60	\N	\N	2026-04-22 14:10:54.375+01	2026-04-22 14:10:54.375+01	43
338	MEC7190766	270607660	0.50	\N	\N	≥ 95	\N	\N	2026-04-22 14:10:54.377+01	2026-04-22 14:10:54.377+01	43
339	MEC7190766	270607660	0.60	\N	\N	≥ 100	\N	\N	2026-04-22 14:10:54.378+01	2026-04-22 14:10:54.378+01	43
340	MEC7190766	270607660	0.75	\N	\N	≥ 120	\N	\N	2026-04-22 14:10:54.379+01	2026-04-22 14:10:54.379+01	43
341	MEC7190766	270607660	1.00	\N	\N	≥ 140	\N	\N	2026-04-22 14:10:54.38+01	2026-04-22 14:10:54.38+01	43
342	MEC7190766	270607660	1.50	\N	\N	≥ 190	\N	\N	2026-04-22 14:10:54.38+01	2026-04-22 14:10:54.38+01	43
343	929989-1	270609770	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.383+01	2026-04-22 14:10:54.383+01	44
344	929989-1	270609770	0.75	\N	4,2 à 4,8	85	\N	\N	2026-04-22 14:10:54.384+01	2026-04-22 14:10:54.384+01	44
345	929989-1	270609770	1.00	\N	4,2 à 4,8	≥ 100	\N	\N	2026-04-22 14:10:54.386+01	2026-04-22 14:10:54.386+01	44
346	1703013-1	270609780	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.387+01	2026-04-22 14:10:54.387+01	44
347	1703013-1	270609780	0.75	\N	4,2 à 4,8	85	\N	\N	2026-04-22 14:10:54.389+01	2026-04-22 14:10:54.389+01	44
348	1703013-1	270609780	1.00	\N	4,2 à 4,8	≥ 100	\N	\N	2026-04-22 14:10:54.39+01	2026-04-22 14:10:54.39+01	44
349	929974-1	270607170	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.392+01	2026-04-22 14:10:54.392+01	44
350	929974-1	270607170	0.75	\N	4,2 à 4,8	85	\N	\N	2026-04-22 14:10:54.395+01	2026-04-22 14:10:54.395+01	44
351	929974-1	270607170	1.00	\N	4,2 à 4,8	≥ 100	\N	\N	2026-04-22 14:10:54.397+01	2026-04-22 14:10:54.397+01	44
352	929967-1	270607160	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.399+01	2026-04-22 14:10:54.399+01	44
353	929967-1	270607160	0.75	\N	4,2 à 4,8	85	\N	\N	2026-04-22 14:10:54.4+01	2026-04-22 14:10:54.4+01	44
354	929967-1	270607160	1.00	\N	4,2 à 4,8	≥ 100	\N	\N	2026-04-22 14:10:54.401+01	2026-04-22 14:10:54.401+01	44
355	929975-1	270607840	1.00	\N	5,2 à 5,8	≥ 100	\N	\N	2026-04-22 14:10:54.402+01	2026-04-22 14:10:54.402+01	44
356	929975-1	270607840	1.50	\N	5,2 à 5,8	≥ 150	\N	\N	2026-04-22 14:10:54.403+01	2026-04-22 14:10:54.403+01	44
357	929975-1	270607840	2.50	\N	5,2 à 5,8	≥ 200	\N	\N	2026-04-22 14:10:54.404+01	2026-04-22 14:10:54.404+01	44
358	929968-1	270607860	1.00	\N	5,2 à 5,8	≥ 100	\N	\N	2026-04-22 14:10:54.405+01	2026-04-22 14:10:54.405+01	44
359	929968-1	270607860	1.50	\N	5,2 à 5,8	≥ 150	\N	\N	2026-04-22 14:10:54.406+01	2026-04-22 14:10:54.406+01	44
360	929968-1	270607860	2.50	\N	5,2 à 5,8	≥ 200	\N	\N	2026-04-22 14:10:54.41+01	2026-04-22 14:10:54.41+01	44
361	61-0897-139	270567610	0.50	\N	8.2	≥ 60	\N	\N	2026-04-22 14:10:54.415+01	2026-04-22 14:10:54.415+01	45
362	61-0892-139	270599170	0.50	\N	8.2	≥ 60	\N	\N	2026-04-22 14:10:54.416+01	2026-04-22 14:10:54.416+01	45
363	61-0898-139	270567620	0.75	\N	8.2	≥ 85	\N	\N	2026-04-22 14:10:54.417+01	2026-04-22 14:10:54.417+01	45
364	61-0898-139	61-0898-139	1.00	\N	8.2	≥ 108	\N	\N	2026-04-22 14:10:54.42+01	2026-04-22 14:10:54.42+01	45
365	61-0893-139	270608480	0.75	\N	8.2	≥ 85	\N	\N	2026-04-22 14:10:54.42+01	2026-04-22 14:10:54.42+01	45
366	61-0893-139	270608480	1.00	\N	8.2	≥ 108	\N	\N	2026-04-22 14:10:54.421+01	2026-04-22 14:10:54.421+01	45
367	61-0899-139	270599130	1.50	\N	8.2	≥ 150	\N	\N	2026-04-22 14:10:54.423+01	2026-04-22 14:10:54.423+01	45
368	61-0894-139	270599160	1.50	\N	8.2	≥ 150	\N	cosse -50 pieces	2026-04-22 14:10:54.426+01	2026-04-22 14:10:54.426+01	45
369	61-0900-139	270608150	2.50	\N	8	≥ 230	\N	manque cosse	2026-04-22 14:10:54.428+01	2026-04-22 14:10:54.428+01	45
370	61-0902-139	270608130	2.50	\N	8	≥ 230	\N	\N	2026-04-22 14:10:54.429+01	2026-04-22 14:10:54.429+01	45
371	1062-16-0622	270610160	0.50	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.432+01	2026-04-22 14:10:54.432+01	46
372	1062-16-0622	270610160	0.75	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.433+01	2026-04-22 14:10:54.433+01	46
373	1062-16-0622	270610160	1.00	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.434+01	2026-04-22 14:10:54.434+01	46
374	1062-16-0644	270612620	0.50	\N	3,8 à 5,08	≥ 67	\N	\N	2026-04-22 14:10:54.434+01	2026-04-22 14:10:54.434+01	46
375	1062-16-0644	270612620	0.75	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.435+01	2026-04-22 14:10:54.435+01	46
376	1062-16-0644	270612620	1.00	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.436+01	2026-04-22 14:10:54.436+01	46
377	1060-16-0622	270610170	0.50	\N	3,8 à 5,08	≥ 67	\N	\N	2026-04-22 14:10:54.437+01	2026-04-22 14:10:54.437+01	46
378	1060-16-0622	270610170	0.75	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.438+01	2026-04-22 14:10:54.438+01	46
379	1060-16-0622	270610170	1.00	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.439+01	2026-04-22 14:10:54.439+01	46
380	1062-16-0622	270610160	0.50	\N	3,8 à 5,08	≥ 67	\N	\N	2026-04-22 14:10:54.48+01	2026-04-22 14:10:54.48+01	47
381	1062-16-0622	270610160	0.75	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.484+01	2026-04-22 14:10:54.484+01	47
382	1062-16-0622	270610160	1.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.485+01	2026-04-22 14:10:54.485+01	47
383	1062-16-0644	270612620	0.50	\N	3,8 à 5,08	≥ 67	\N	\N	2026-04-22 14:10:54.488+01	2026-04-22 14:10:54.488+01	47
384	1062-16-0644	270612620	0.75	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.49+01	2026-04-22 14:10:54.49+01	47
385	1062-16-0644	270612620	1.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.492+01	2026-04-22 14:10:54.492+01	47
386	1060-16-0622	270610170	0.50	\N	3,8 à 5,08	≥ 67	\N	\N	2026-04-22 14:10:54.494+01	2026-04-22 14:10:54.494+01	47
387	1060-16-0622	270610170	0.75	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.495+01	2026-04-22 14:10:54.495+01	47
388	1060-16-0622	270610170	1.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.497+01	2026-04-22 14:10:54.497+01	47
389	5-965906-1	270609340	0.50	\N	3,35 à 3,65	≥ 60	\N	manque cosse	2026-04-22 14:10:54.521+01	2026-04-22 14:10:54.521+01	48
390	5-965906-1	270609340	0.75	\N	3,35 à 3,65	≥ 85	\N	\N	2026-04-22 14:10:54.523+01	2026-04-22 14:10:54.523+01	48
391	794229-1	270610250	0.35	\N	3,2 à 3,71	≥ 48,9	\N	cosse -50 pieces	2026-04-22 14:10:54.529+01	2026-04-22 14:10:54.529+01	49
392	794229-1	270610250	0.50	\N	3,2 à 3,71	≥ 57,8	\N	\N	2026-04-22 14:10:54.53+01	2026-04-22 14:10:54.53+01	49
393	794229-1	270610250	0.75	\N	3,2 à 3,71	≥ 66,7	\N	\N	2026-04-22 14:10:54.531+01	2026-04-22 14:10:54.531+01	49
394	794231-1	270610260	0.50	\N	3,2 à 3,71	≥ 57,8	\N	manque cosse	2026-04-22 14:10:54.533+01	2026-04-22 14:10:54.533+01	49
395	794231-1	270610260	0.75	\N	3,2 à 3,71	≥ 66,7	\N	\N	2026-04-22 14:10:54.534+01	2026-04-22 14:10:54.534+01	49
396	794231-1	270610260	1.20	\N	3,2 à 3,71	≥ 80,1	\N	\N	2026-04-22 14:10:54.535+01	2026-04-22 14:10:54.535+01	49
397	794230-1	270610200	0.50	\N	3,2 à 3,71	≥ 57,8	\N	manque cosse	2026-04-22 14:10:54.537+01	2026-04-22 14:10:54.537+01	49
398	794230-1	270610200	0.75	\N	3,2 à 3,71	≥ 66,7	\N	\N	2026-04-22 14:10:54.538+01	2026-04-22 14:10:54.538+01	49
399	794230-1	270610200	1.20	\N	3,2 à 3,71	≥ 80,1	\N	\N	2026-04-22 14:10:54.539+01	2026-04-22 14:10:54.539+01	49
400	1062-16-1222	270610680	1.00	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.559+01	2026-04-22 14:10:54.559+01	51
401	1062-16-1222	270610680	1.50	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.561+01	2026-04-22 14:10:54.561+01	51
402	1062-16-1222	270610680	2.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.562+01	2026-04-22 14:10:54.562+01	51
403	1062-16-1222	270610680	2.50	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.563+01	2026-04-22 14:10:54.563+01	51
404	1060-16-1222	270610660	1.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.564+01	2026-04-22 14:10:54.564+01	51
405	1060-16-1222	270610660	1.50	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.565+01	2026-04-22 14:10:54.565+01	51
406	1060-16-1222	270610660	2.00	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.566+01	2026-04-22 14:10:54.566+01	51
407	1060-16-1222	270610660	2.50	\N	3,8 à 5,08	\N	\N	\N	2026-04-22 14:10:54.567+01	2026-04-22 14:10:54.567+01	51
408	969028-2	270615060	0.20	\N	3,2 à 3,8	≥ 30	\N	cosse -50 pieces	2026-04-22 14:10:54.57+01	2026-04-22 14:10:54.57+01	52
409	969028-2	270615060	0.25	\N	3,2 à 3,8	≥ 35	\N	\N	2026-04-22 14:10:54.571+01	2026-04-22 14:10:54.571+01	52
410	969028-2	270615060	0.35	\N	3,2 à 3,8	≥ 50	\N	\N	2026-04-22 14:10:54.572+01	2026-04-22 14:10:54.572+01	52
411	969028-2	270615060	0.50	\N	3,2 à 3,8	≥ 60	\N	\N	2026-04-22 14:10:54.573+01	2026-04-22 14:10:54.573+01	52
412	964269-2	270608200	0.50	\N	3,7 à 4,3	≥ 60	\N	\N	2026-04-22 14:10:54.573+01	2026-04-22 14:10:54.573+01	52
413	964269-2	270608200	0.75	\N	3,7 à 4,3	≥ 85	\N	\N	2026-04-22 14:10:54.575+01	2026-04-22 14:10:54.575+01	52
414	964269-2	270608200	1.00	\N	3,7 à 4,3	≥ 108	\N	\N	2026-04-22 14:10:54.578+01	2026-04-22 14:10:54.578+01	52
415	964269-3	270618760	0.50	\N	3,7 à 4,3	≥ 60	\N	\N	2026-04-22 14:10:54.58+01	2026-04-22 14:10:54.58+01	52
416	964269-3	270618760	0.75	\N	3,7 à 4,3	≥ 85	\N	\N	2026-04-22 14:10:54.581+01	2026-04-22 14:10:54.581+01	52
417	964269-3	270618760	1.00	\N	3,7 à 4,3	≥ 108	\N	\N	2026-04-22 14:10:54.582+01	2026-04-22 14:10:54.582+01	52
418	1241380-3	270625530	0.50	\N	3,7 à 4,3	≥ 60	\N	manque cosse	2026-04-22 14:10:54.584+01	2026-04-22 14:10:54.584+01	53
419	1241380-3	270625530	0.75	\N	3,7 à 4,3	≥ 85	\N	\N	2026-04-22 14:10:54.586+01	2026-04-22 14:10:54.586+01	53
420	1241380-3	270625530	1.00	\N	3,7 à 4,3	≥ 108	\N	\N	2026-04-22 14:10:54.587+01	2026-04-22 14:10:54.587+01	53
421	1241380-1	270608000	0.50	\N	3,7 à 4,3	≥ 60	\N	\N	2026-04-22 14:10:54.588+01	2026-04-22 14:10:54.588+01	53
422	1241380-1	270608000	0.75	\N	3,7 à 4,3	≥ 85	\N	\N	2026-04-22 14:10:54.59+01	2026-04-22 14:10:54.59+01	53
423	1241380-1	270608000	1.00	\N	3,7 à 4,3	≥ 108	\N	\N	2026-04-22 14:10:54.593+01	2026-04-22 14:10:54.593+01	53
424	1241380-2	270618750	0.50	\N	3,7 à 4,3	≥ 60	\N	\N	2026-04-22 14:10:54.595+01	2026-04-22 14:10:54.595+01	53
425	1241380-2	270618750	0.75	\N	3,7 à 4,3	≥ 85	\N	\N	2026-04-22 14:10:54.596+01	2026-04-22 14:10:54.596+01	53
426	1241380-2	270618750	1.00	\N	3,7 à 4,3	≥ 108	\N	\N	2026-04-22 14:10:54.596+01	2026-04-22 14:10:54.596+01	53
427	1418884-1	270608010	1.00	\N	3,7 à 4,3	≥ 108	\N	\N	2026-04-22 14:10:54.598+01	2026-04-22 14:10:54.598+01	54
428	1418884-1	270608010	1.50	\N	3,7 à 4,3	≥ 150	\N	\N	2026-04-22 14:10:54.601+01	2026-04-22 14:10:54.601+01	54
429	1703278-2	270608180	1.50	\N	3,7 à 4,3	\N	\N	cosse -50 pieces	2026-04-22 14:10:54.603+01	2026-04-22 14:10:54.603+01	54
430	1-968857-3	270612950	1.00	\N	4,7 à 5,3	≥ 108	\N	\N	2026-04-22 14:10:54.605+01	2026-04-22 14:10:54.605+01	55
431	1-968857-3	270612950	1.50	\N	4,7 à 5,3	≥ 150	\N	\N	2026-04-22 14:10:54.607+01	2026-04-22 14:10:54.607+01	55
432	1-968857-3	270612950	2.50	\N	4,7 à 5,3	≥ 200	\N	\N	2026-04-22 14:10:54.608+01	2026-04-22 14:10:54.608+01	55
433	1-968857-1	270608260	1.00	\N	4,7 à 5,3	≥ 108	\N	\N	2026-04-22 14:10:54.609+01	2026-04-22 14:10:54.609+01	55
434	1-968857-1	270608260	1.50	\N	4,7 à 5,3	≥ 150	\N	\N	2026-04-22 14:10:54.61+01	2026-04-22 14:10:54.61+01	55
435	1-968857-1	270608260	2.50	\N	4,7 à 5,3	≥ 200	\N	\N	2026-04-22 14:10:54.611+01	2026-04-22 14:10:54.611+01	55
436	282466-1	270567128	1.50	\N	3,5 à 4	≥ 155	\N	\N	2026-04-22 14:10:54.613+01	2026-04-22 14:10:54.613+01	55
437	282466-1	270567128	2.50	\N	3,5 à 4	\N	\N	\N	2026-04-22 14:10:54.613+01	2026-04-22 14:10:54.613+01	55
438	282465-1	270599190	1.50	\N	3,5 à 4	155	\N	\N	2026-04-22 14:10:54.614+01	2026-04-22 14:10:54.614+01	55
439	282465-1	270599190	2.50	\N	3,5 à 4	\N	\N	\N	2026-04-22 14:10:54.615+01	2026-04-22 14:10:54.615+01	55
440	1-962916-1	270616730	1.50	\N	4,7 à 5,3	≥ 150	\N	manque cosse	2026-04-22 14:10:54.617+01	2026-04-22 14:10:54.617+01	56
441	1-962916-1	270616730	2.50	\N	4,7 à 5,3	≥ 200	\N	\N	2026-04-22 14:10:54.617+01	2026-04-22 14:10:54.617+01	56
442	1-962915-1	270617140	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.618+01	2026-04-22 14:10:54.618+01	56
443	1-962915-1	270617140	0.75	\N	4,2 à 4,8	≥ 85	\N	\N	2026-04-22 14:10:54.619+01	2026-04-22 14:10:54.619+01	56
444	1-962915-1	270617140	1.00	\N	4,2 à 4,8	≥ 108	\N	\N	2026-04-22 14:10:54.619+01	2026-04-22 14:10:54.619+01	56
445	1-962841-1	270614920	0.50	\N	3,9 à 4,5	≥ 60	\N	cosse -50 pieces	2026-04-22 14:10:54.62+01	2026-04-22 14:10:54.62+01	56
446	1-962841-1	270614920	0.75	\N	3,9 à 4,5	≥ 85	\N	\N	2026-04-22 14:10:54.622+01	2026-04-22 14:10:54.622+01	56
447	1-962841-1	270614920	1.00	\N	3,9 à 4,5	≥ 108	\N	\N	2026-04-22 14:10:54.624+01	2026-04-22 14:10:54.624+01	56
448	1-962916-2	270612960	1.00	\N	4,7 à 5,3	≥ 108	\N	\N	2026-04-22 14:10:54.626+01	2026-04-22 14:10:54.626+01	56
449	1-962916-2	270612960	1.50	\N	4,7 à 5,3	≥ 150	\N	\N	2026-04-22 14:10:54.626+01	2026-04-22 14:10:54.626+01	56
450	1-962916-2	270612960	2.50	\N	4,7 à 5,3	≥ 200	\N	\N	2026-04-22 14:10:54.627+01	2026-04-22 14:10:54.627+01	56
451	1-962916-1	270608210	1.00	\N	4,7 à 5,3	≥ 108	\N	\N	2026-04-22 14:10:54.628+01	2026-04-22 14:10:54.628+01	56
452	1-962916-1	270608210	1.50	\N	4,7 à 5,3	≥ 150	\N	\N	2026-04-22 14:10:54.628+01	2026-04-22 14:10:54.628+01	56
453	1-962916-1	270608210	2.50	\N	4,7 à 5,3	≥ 200	\N	\N	2026-04-22 14:10:54.63+01	2026-04-22 14:10:54.63+01	56
454	1-968855-1	270610540	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.633+01	2026-04-22 14:10:54.633+01	57
455	1-968855-1	270610540	0.75	\N	4,2 à 4,8	≥ 85	\N	\N	2026-04-22 14:10:54.634+01	2026-04-22 14:10:54.634+01	57
456	1-968855-1	270610540	1.00	\N	4,2 à 4,8	≥ 108	\N	\N	2026-04-22 14:10:54.635+01	2026-04-22 14:10:54.635+01	57
457	1241418-4	270610550	4.00	\N	5,1 à 5,7	≥ 310	\N	\N	2026-04-22 14:10:54.638+01	2026-04-22 14:10:54.638+01	58
458	1241418-4	270610550	6.00	\N	5,1 à 5,7	≥ 450	\N	\N	2026-04-22 14:10:54.641+01	2026-04-22 14:10:54.641+01	58
459	2-2112966-2	270610570	4.00	\N	5,1 à 5,7	≥ 310	\N	\N	2026-04-22 14:10:54.643+01	2026-04-22 14:10:54.643+01	58
460	2-2112966-2	270610570	6.00	\N	5,1 à 5,7	≥ 450	\N	\N	2026-04-22 14:10:54.644+01	2026-04-22 14:10:54.644+01	58
461	4250000873	270567043	0.75	\N	4.5	≥ 37	\N	\N	2026-04-22 14:10:54.649+01	2026-04-22 14:10:54.649+01	60
462	4250000873	270567043	1.00	\N	4.5	≥ 58	\N	\N	2026-04-22 14:10:54.65+01	2026-04-22 14:10:54.65+01	60
463	4250000873	270567043	2.00	\N	4.5	≥ 62	\N	\N	2026-04-22 14:10:54.651+01	2026-04-22 14:10:54.651+01	60
464	\N	Pince sertissage embout cablage 0,14 à 6mm²	\N	\N	\N	\N	\N	verefication visuelle	2026-04-22 14:10:54.653+01	2026-04-22 14:10:54.653+01	61
465	\N	Pince sertissage embout cablage 0,14 à 6mm²	\N	\N	\N	\N	\N	verefication visuelle	2026-04-22 14:10:54.656+01	2026-04-22 14:10:54.656+01	62
466	\N	Pince sertissage embout cablage 0,14 à 6mm²	\N	\N	\N	\N	\N	verefication visuelle	2026-04-22 14:10:54.659+01	2026-04-22 14:10:54.659+01	63
467	1062-12-0222	270610960	4.00	\N	6,35 à 7,62	≥311	\N	\N	2026-04-22 14:10:54.663+01	2026-04-22 14:10:54.663+01	65
468	1062-12-0222	270610960	6.00	\N	6,35 à 7,62	≥311	\N	\N	2026-04-22 14:10:54.664+01	2026-04-22 14:10:54.664+01	65
469	1060-12-0222	270613570	4.00	\N	6,35 à 7,62	≥311	\N	\N	2026-04-22 14:10:54.665+01	2026-04-22 14:10:54.665+01	65
470	1060-12-0222	270613570	6.00	\N	6,35 à 7,62	≥311	\N	\N	2026-04-22 14:10:54.665+01	2026-04-22 14:10:54.665+01	65
471	962876-1	270611160	0.50	\N	3.8	≥ 60	\N	\N	2026-04-22 14:10:54.667+01	2026-04-22 14:10:54.667+01	66
472	962876-1	270611160	0.75	\N	3.8	\N	\N	\N	2026-04-22 14:10:54.669+01	2026-04-22 14:10:54.669+01	66
473	962876-1	270611160	1.00	\N	3.8	≥ 100	\N	\N	2026-04-22 14:10:54.67+01	2026-04-22 14:10:54.67+01	66
474	SXH-001T-P0.6	270611430	0.08	\N	2,1 à 2,6	≥ 9,8	\N	\N	2026-04-22 14:10:54.674+01	2026-04-22 14:10:54.674+01	67
475	SXH-001T-P0.6	270611430	0.12	\N	2,1 à 2,6	≥ 19,6	\N	\N	2026-04-22 14:10:54.675+01	2026-04-22 14:10:54.675+01	67
476	SXH-001T-P0.6	270611430	0.22	\N	2,1 à 2,6	≥ 29,4	\N	\N	2026-04-22 14:10:54.676+01	2026-04-22 14:10:54.676+01	67
477	SXH-001T-P0.6	270611430	0.32	\N	2,1 à 2,6	≥ 39,2	\N	\N	2026-04-22 14:10:54.676+01	2026-04-22 14:10:54.676+01	67
478	SVF-81T-P2.0	270611340	3.50	\N	5 à 5,5	≥ 150	\N	manque cosse	2026-04-22 14:10:54.68+01	2026-04-22 14:10:54.68+01	68
479	SVF-61T-P2.0	270611400	0.50	\N	5 à 5,5	≥ 65	\N	manque cosse	2026-04-22 14:10:54.682+01	2026-04-22 14:10:54.682+01	69
480	SVF-61T-P2.0	270611400	0.75	\N	5 à 5,5	≥ 80	\N	\N	2026-04-22 14:10:54.683+01	2026-04-22 14:10:54.683+01	69
481	SVF-61T-P2.0	270611400	1.25	\N	5 à 5,5	≥ 100	\N	\N	2026-04-22 14:10:54.684+01	2026-04-22 14:10:54.684+01	69
482	SVF-61T-P2.0	270611400	2.00	\N	5 à 5,5	≥ 150	\N	\N	2026-04-22 14:10:54.685+01	2026-04-22 14:10:54.685+01	69
483	1062-12-0166	270600880	2.00	\N	6,35 à 7,62	≥ 222	\N	\N	2026-04-22 14:10:54.687+01	2026-04-22 14:10:54.687+01	70
484	1062-12-0166	270600880	2.50	\N	6,35 à 7,63	≥ 222	\N	\N	2026-04-22 14:10:54.688+01	2026-04-22 14:10:54.688+01	70
485	1062-12-0166	270600880	4.00	\N	6,35 à 7,64	≥311	\N	\N	2026-04-22 14:10:54.689+01	2026-04-22 14:10:54.689+01	70
486	1060-12-0166	270600870	2.00	\N	6,35 à 7,65	≥ 222	\N	\N	2026-04-22 14:10:54.69+01	2026-04-22 14:10:54.69+01	70
487	1060-12-0166	270600870	2.50	\N	6,35 à 7,66	≥ 222	\N	\N	2026-04-22 14:10:54.691+01	2026-04-22 14:10:54.691+01	70
488	1060-12-0166	270600870	4.00	\N	6,35 à 7,67	≥311	\N	\N	2026-04-22 14:10:54.693+01	2026-04-22 14:10:54.693+01	70
489	929990-1	270609790	1.00	\N	4,7 à 5,3	≥ 100	\N	\N	2026-04-22 14:10:54.699+01	2026-04-22 14:10:54.699+01	71
490	929990-1	270609790	1.50	\N	4,7 à 5,3	≥ 150	\N	\N	2026-04-22 14:10:54.7+01	2026-04-22 14:10:54.7+01	71
491	929990-1	270609790	2.50	\N	4,7 à 5,3	≥ 200	\N	\N	2026-04-22 14:10:54.703+01	2026-04-22 14:10:54.703+01	71
492	1703014-1	270609800	1.00	\N	4,7 à 5,3	≥ 100	\N	\N	2026-04-22 14:10:54.704+01	2026-04-22 14:10:54.704+01	71
493	1703014-1	270609800	1.50	\N	4,7 à 5,3	≥ 150	\N	\N	2026-04-22 14:10:54.705+01	2026-04-22 14:10:54.705+01	71
494	1703014-1	270609800	2.50	\N	4,7 à 5,3	≥ 200	\N	\N	2026-04-22 14:10:54.708+01	2026-04-22 14:10:54.708+01	71
495	794229-1	270610250	0.35	\N	3,2 à 3,71	≥ 48,9	\N	cosse -50 pieces	2026-04-22 14:10:54.713+01	2026-04-22 14:10:54.713+01	73
496	794229-1	270610250	0.50	\N	3,2 à 3,71	≥ 57,8	\N	\N	2026-04-22 14:10:54.714+01	2026-04-22 14:10:54.714+01	73
497	794229-1	270610250	0.75	\N	3,2 à 3,71	≥ 66,7	\N	\N	2026-04-22 14:10:54.715+01	2026-04-22 14:10:54.715+01	73
498	929989-1	270609770	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.717+01	2026-04-22 14:10:54.717+01	74
499	929989-1	270609770	0.75	\N	4,2 à 4,8	\N	\N	\N	2026-04-22 14:10:54.719+01	2026-04-22 14:10:54.719+01	74
500	929989-1	270609770	1.00	\N	4,2 à 4,8	≥ 100	\N	\N	2026-04-22 14:10:54.721+01	2026-04-22 14:10:54.721+01	74
501	1703013-1	270609780	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.722+01	2026-04-22 14:10:54.722+01	74
502	1703013-1	270609780	0.75	\N	4,2 à 4,8	\N	\N	\N	2026-04-22 14:10:54.725+01	2026-04-22 14:10:54.725+01	74
503	1703013-1	270609780	1.00	\N	4,2 à 4,8	≥ 100	\N	\N	2026-04-22 14:10:54.727+01	2026-04-22 14:10:54.727+01	74
504	929974-1	270607170	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.729+01	2026-04-22 14:10:54.729+01	74
505	929974-1	270607170	0.75	\N	4,2 à 4,8	\N	\N	\N	2026-04-22 14:10:54.73+01	2026-04-22 14:10:54.73+01	74
506	929974-1	270607170	1.00	\N	4,2 à 4,8	≥ 100	\N	\N	2026-04-22 14:10:54.731+01	2026-04-22 14:10:54.731+01	74
507	929967-1	270607160	0.50	\N	4,2 à 4,8	≥ 60	\N	\N	2026-04-22 14:10:54.731+01	2026-04-22 14:10:54.731+01	74
508	929967-1	270607160	0.75	\N	4,2 à 4,8	\N	\N	\N	2026-04-22 14:10:54.732+01	2026-04-22 14:10:54.732+01	74
509	929967-1	270607160	1.00	\N	4,2 à 4,8	≥ 100	\N	\N	2026-04-22 14:10:54.733+01	2026-04-22 14:10:54.733+01	74
510	929975-1	270607840	1.00	\N	5,2 à 5,8	≥ 100	\N	\N	2026-04-22 14:10:54.734+01	2026-04-22 14:10:54.734+01	74
511	929975-1	270607840	1.50	\N	5,2 à 5,8	≥ 150	\N	\N	2026-04-22 14:10:54.734+01	2026-04-22 14:10:54.734+01	74
512	929975-1	270607840	2.50	\N	5,2 à 5,8	≥ 200	\N	\N	2026-04-22 14:10:54.735+01	2026-04-22 14:10:54.735+01	74
513	929968-1	270607860	1.00	\N	5,2 à 5,8	≥ 100	\N	\N	2026-04-22 14:10:54.736+01	2026-04-22 14:10:54.736+01	74
514	929968-1	270607860	1.50	\N	5,2 à 5,8	≥ 150	\N	\N	2026-04-22 14:10:54.737+01	2026-04-22 14:10:54.737+01	74
515	929968-1	270607860	2.50	\N	5,2 à 5,8	≥ 200	\N	\N	2026-04-22 14:10:54.737+01	2026-04-22 14:10:54.737+01	74
516	1062-12-0222	270610960	4.00	\N	6,35 à 7,62	≥311	\N	\N	2026-04-22 14:10:54.74+01	2026-04-22 14:10:54.74+01	75
517	1062-12-0222	270610960	6.00	\N	6,35 à 7,62	≥311	\N	\N	2026-04-22 14:10:54.742+01	2026-04-22 14:10:54.742+01	75
518	1060-12-0222	270613570	4.00	\N	6,35 à 7,62	≥311	\N	\N	2026-04-22 14:10:54.743+01	2026-04-22 14:10:54.743+01	75
519	1060-12-0222	270613570	6.00	\N	6,35 à 7,62	≥311	\N	\N	2026-04-22 14:10:54.745+01	2026-04-22 14:10:54.745+01	75
520	1062-16-1222	270610680	1.00	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.748+01	2026-04-22 14:10:54.748+01	76
521	1062-16-1222	270610680	1.50	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.749+01	2026-04-22 14:10:54.749+01	76
522	1062-16-1222	270610680	2.00	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.75+01	2026-04-22 14:10:54.75+01	76
523	1062-16-1222	270610680	2.50	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.751+01	2026-04-22 14:10:54.751+01	76
524	1060-16-1222	270610660	1.00	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.752+01	2026-04-22 14:10:54.752+01	76
525	1060-16-1222	270610660	1.50	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.752+01	2026-04-22 14:10:54.752+01	76
526	1060-16-1222	270610660	2.00	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.754+01	2026-04-22 14:10:54.754+01	76
527	1060-16-1222	270610660	2.50	\N	3,8 à 5,08	≥ 111	\N	\N	2026-04-22 14:10:54.757+01	2026-04-22 14:10:54.757+01	76
528	1062-20-0622	270623580	1.00	\N	3,81 à 5,08	≥ 89	\N	manque cosse	2026-04-22 14:10:54.76+01	2026-04-22 14:10:54.76+01	76
529	1062-20-0622	270623580	1.50	\N	3,81 à 5,08	≥ 89	\N	\N	2026-04-22 14:10:54.76+01	2026-04-22 14:10:54.76+01	76
530	1062-20-0622	270623580	2.00	\N	3,81 à 5,08	≥ 89	\N	\N	2026-04-22 14:10:54.761+01	2026-04-22 14:10:54.761+01	76
531	1062-20-0622	270623580	2.50	\N	3,81 à 5,08	≥ 89	\N	\N	2026-04-22 14:10:54.762+01	2026-04-22 14:10:54.762+01	76
532	SP20M2F	270612020	0.35	\N	4.5	≥ 36	\N	\N	2026-04-22 14:10:54.766+01	2026-04-22 14:10:54.766+01	78
533	SP20M2F	270612020	0.50	\N	4.5	≥ 58	\N	\N	2026-04-22 14:10:54.767+01	2026-04-22 14:10:54.767+01	78
534	SP16M1F	270612030	0.75	\N	4	≥ 89	\N	\N	2026-04-22 14:10:54.769+01	2026-04-22 14:10:54.769+01	78
535	SP16M1F	270612030	1.00	\N	4	≥ 105	\N	\N	2026-04-22 14:10:54.77+01	2026-04-22 14:10:54.77+01	78
536	SP16M1F	270612030	1.50	\N	4	≥ 134	\N	\N	2026-04-22 14:10:54.772+01	2026-04-22 14:10:54.772+01	78
537	770854-1	270600650	0.50	\N	5.1	\N	\N	\N	2026-04-22 14:10:54.777+01	2026-04-22 14:10:54.777+01	79
538	770854-1	270600650	0.75	\N	5.1	\N	\N	\N	2026-04-22 14:10:54.778+01	2026-04-22 14:10:54.778+01	79
539	770854-1	270600650	1.00	\N	5.1	\N	\N	\N	2026-04-22 14:10:54.779+01	2026-04-22 14:10:54.779+01	79
540	770854-1	270600650	1.50	\N	5.1	\N	\N	\N	2026-04-22 14:10:54.779+01	2026-04-22 14:10:54.779+01	79
541	1241412-3	270612970	0.50	\N	3,9 à 4,5	≥ 60	\N	cosse -50 pieces	2026-04-22 14:10:54.782+01	2026-04-22 14:10:54.782+01	80
542	1241412-3	270612970	0.75	\N	3,9 à 4,5	≥ 85	\N	\N	2026-04-22 14:10:54.783+01	2026-04-22 14:10:54.783+01	80
543	1241412-3	270612970	1.00	\N	3,9 à 4,5	≥ 140	\N	\N	2026-04-22 14:10:54.784+01	2026-04-22 14:10:54.784+01	80
544	1-962917-1	270612980	0.50	\N	4,7 à 5,3	≥ 60	\N	\N	2026-04-22 14:10:54.79+01	2026-04-22 14:10:54.79+01	81
545	1-962917-1	270612980	0.75	\N	4,7 à 5,3	≥ 85	\N	\N	2026-04-22 14:10:54.792+01	2026-04-22 14:10:54.792+01	81
546	1-962917-1	270612980	1.00	\N	4,7 à 5,3	≥ 140	\N	\N	2026-04-22 14:10:54.794+01	2026-04-22 14:10:54.794+01	81
547	\N	270613350	1.50	\N	\N	200	\N	\N	2026-04-22 14:10:54.797+01	2026-04-22 14:10:54.797+01	82
548	\N	270613350	2.00	\N	\N	230	\N	\N	2026-04-22 14:10:54.799+01	2026-04-22 14:10:54.799+01	82
549	\N	270613350	2.50	\N	\N	250	\N	\N	2026-04-22 14:10:54.801+01	2026-04-22 14:10:54.801+01	82
550	12084200	270567114	0.30	\N	4 à 4,5	\N	\N	\N	2026-04-22 14:10:54.804+01	2026-04-22 14:10:54.804+01	83
551	12084200	270567114	0.50	\N	4 à 4,5	\N	\N	\N	2026-04-22 14:10:54.805+01	2026-04-22 14:10:54.805+01	83
552	12048074	270599000	0.50	\N	4 à 4,5	≥ 75	\N	\N	2026-04-22 14:10:54.806+01	2026-04-22 14:10:54.806+01	83
553	12048074	270599000	0.75	\N	4 à 4,5	≥ 120	\N	\N	2026-04-22 14:10:54.807+01	2026-04-22 14:10:54.807+01	83
554	12048074	270599000	1.00	\N	4 à 4,5	≥ 160	\N	\N	2026-04-22 14:10:54.809+01	2026-04-22 14:10:54.809+01	83
555	211CC3S2160	270613340	0.50	\N	4.2	80	\N	\N	2026-04-22 14:10:54.813+01	2026-04-22 14:10:54.813+01	84
556	211CC3S2160	270613340	0.75	\N	4.2	140	\N	\N	2026-04-22 14:10:54.814+01	2026-04-22 14:10:54.814+01	84
557	3-1447221-4	270613280	0.50	\N	3,5 à 4,5	≥ 50	\N	\N	2026-04-22 14:10:54.817+01	2026-04-22 14:10:54.817+01	85
558	\N	270613350	0.35	\N	3,5 à 4,5	75	\N	\N	2026-04-22 14:10:54.821+01	2026-04-22 14:10:54.821+01	86
559	\N	270613350	0.75	\N	3,5 à 4,5	75	\N	\N	2026-04-22 14:10:54.823+01	2026-04-22 14:10:54.823+01	86
560	\N	270617450	1.35	\N	3,5 à 4,5	200	\N	\N	2026-04-22 14:10:54.825+01	2026-04-22 14:10:54.825+01	86
561	\N	270617450	2.00	\N	3,5 à 4,5	230	\N	\N	2026-04-22 14:10:54.827+01	2026-04-22 14:10:54.827+01	86
562	211CC3S2160	270617460	1.50	\N	4.2	200	\N	cosse 270613340 -50 pieces	2026-04-22 14:10:54.832+01	2026-04-22 14:10:54.832+01	88
563	211CC3S2160	270617460	2.50	\N	4.2	230	\N	\N	2026-04-22 14:10:54.835+01	2026-04-22 14:10:54.835+01	88
564	211CC3S2160	270613340	0.50	\N	4.2	80	\N	\N	2026-04-22 14:10:54.837+01	2026-04-22 14:10:54.837+01	88
565	211CC3S2160	270613340	0.75	\N	4.2	140	\N	\N	2026-04-22 14:10:54.837+01	2026-04-22 14:10:54.837+01	88
566	7-1452668-1	270620980	0.50	\N	3,3 à 3,9	≥ 60	\N	manque cosse	2026-04-22 14:10:54.843+01	2026-04-22 14:10:54.843+01	90
567	7-1452668-1	270620980	0.75	\N	3,3 à 3,9	≥ 85	\N	\N	2026-04-22 14:10:54.844+01	2026-04-22 14:10:54.844+01	90
568	7-1452668-1	270618550	0.50	\N	3,3 à 3,9	≥ 60	\N	\N	2026-04-22 14:10:54.845+01	2026-04-22 14:10:54.845+01	90
569	7-1452668-1	270618550	0.75	\N	3,3 à 3,9	≥ 85	\N	\N	2026-04-22 14:10:54.846+01	2026-04-22 14:10:54.846+01	90
570	192900-0003	270613780	0.75	\N	3,7 à 4,2	\N	\N	cosse -50 pieces	2026-04-22 14:10:54.848+01	2026-04-22 14:10:54.848+01	91
571	192900-0003	270613780	1.00	\N	3,7 à 4,2	\N	\N	\N	2026-04-22 14:10:54.85+01	2026-04-22 14:10:54.85+01	91
572	192900-0003	270613780	1.50	\N	3,7 à 4,2	\N	\N	\N	2026-04-22 14:10:54.852+01	2026-04-22 14:10:54.852+01	91
573	\N	270614220	0.50	\N	\N	\N	\N	\N	2026-04-22 14:10:54.855+01	2026-04-22 14:10:54.855+01	92
574	\N	270614220	1.00	\N	\N	\N	\N	\N	2026-04-22 14:10:54.857+01	2026-04-22 14:10:54.857+01	92
575	\N	270614220	1.50	\N	\N	\N	\N	\N	2026-04-22 14:10:54.859+01	2026-04-22 14:10:54.859+01	92
576	175030-1	270614560	\N	\N	3,5 à 4,5	\N	\N	manque cosse	2026-04-22 14:10:54.864+01	2026-04-22 14:10:54.864+01	94
577	175030-1	270614560	\N	\N	3,5 à 4,5	\N	\N	\N	2026-04-22 14:10:54.865+01	2026-04-22 14:10:54.865+01	94
578	175030-1	270614560	\N	\N	3,5 à 4,5	\N	\N	\N	2026-04-22 14:10:54.866+01	2026-04-22 14:10:54.866+01	94
579	MEC7190766	270600100	0.50	\N	\N	95	\N	270607660 cossse manquer	2026-04-22 14:10:54.868+01	2026-04-22 14:10:54.868+01	95
580	MEC7190766	270600100	75.00	\N	\N	120	\N	\N	2026-04-22 14:10:54.87+01	2026-04-22 14:10:54.87+01	95
581	MEC7190766	270600100	1.00	\N	\N	140	\N	\N	2026-04-22 14:10:54.872+01	2026-04-22 14:10:54.872+01	95
582	MEC7190766	270607670	1.50	\N	\N	190	\N	\N	2026-04-22 14:10:54.874+01	2026-04-22 14:10:54.874+01	95
583	MEC7190766	270567004	4.00	\N	\N	\N	\N	\N	2026-04-22 14:10:54.876+01	2026-04-22 14:10:54.876+01	95
584	MEC7190766	270567004	6.00	\N	\N	\N	\N	\N	2026-04-22 14:10:54.878+01	2026-04-22 14:10:54.878+01	95
585	MEC7190766	270607660	0.34	\N	\N	≥ 60	\N	\N	2026-04-22 14:10:54.879+01	2026-04-22 14:10:54.879+01	95
586	MEC7190766	270607660	0.50	\N	\N	≥ 95	\N	\N	2026-04-22 14:10:54.88+01	2026-04-22 14:10:54.88+01	95
587	MEC7190766	270607660	0.60	\N	\N	≥ 100	\N	\N	2026-04-22 14:10:54.881+01	2026-04-22 14:10:54.881+01	95
588	MEC7190766	270607660	0.75	\N	\N	≥ 120	\N	\N	2026-04-22 14:10:54.882+01	2026-04-22 14:10:54.882+01	95
589	MEC7190766	270607660	1.00	\N	\N	≥ 140	\N	\N	2026-04-22 14:10:54.882+01	2026-04-22 14:10:54.882+01	95
590	MEC7190766	270607660	1.50	\N	\N	≥ 190	\N	\N	2026-04-22 14:10:54.883+01	2026-04-22 14:10:54.883+01	95
591	SEH-001T-P0.6	923926200	0.05	\N	\N	\N	\N	\N	2026-04-22 14:10:54.887+01	2026-04-22 14:10:54.887+01	97
592	SEH-001T-P0.6	923926200	0.08	\N	\N	\N	\N	\N	2026-04-22 14:10:54.888+01	2026-04-22 14:10:54.888+01	97
593	SEH-001T-P0.6	923926200	0.12	\N	\N	\N	\N	\N	2026-04-22 14:10:54.889+01	2026-04-22 14:10:54.889+01	97
594	SEH-001T-P0.6	923926200	0.22	\N	\N	\N	\N	\N	2026-04-22 14:10:54.89+01	2026-04-22 14:10:54.89+01	97
595	SEH-001T-P0.6	923926200	0.32	\N	\N	\N	\N	\N	2026-04-22 14:10:54.891+01	2026-04-22 14:10:54.891+01	97
596	1-962916-1	270616730	1.50	\N	4,7 à 5,3	≥ 150	\N	manque cosse	2026-04-22 14:10:54.894+01	2026-04-22 14:10:54.894+01	98
597	1-962916-1	270616730	2.50	\N	4,7 à 5,3	≥ 200	\N	\N	2026-04-22 14:10:54.895+01	2026-04-22 14:10:54.895+01	98
598	1-962916-1	270616730	0.50	\N	3,9 à 4,5	≥ 60	\N	\N	2026-04-22 14:10:54.896+01	2026-04-22 14:10:54.896+01	98
599	1-962916-1	270616730	0.75	\N	3,9 à 4,5	≥ 85	\N	\N	2026-04-22 14:10:54.897+01	2026-04-22 14:10:54.897+01	98
600	1-962916-1	270616730	1.00	\N	3,9 à 4,5	≥ 108	\N	\N	2026-04-22 14:10:54.898+01	2026-04-22 14:10:54.898+01	98
601	1418762-1	270614910	1.00	\N	3,3 à 3,9	≥ 108	\N	cosse -50 pieces	2026-04-22 14:10:54.9+01	2026-04-22 14:10:54.9+01	99
602	1418762-1	270614910	1.50	\N	3,3 à 3,9	≥ 150	\N	\N	2026-04-22 14:10:54.901+01	2026-04-22 14:10:54.901+01	99
603	\N	270614360	0.35	\N	\N	\N	\N	\N	2026-04-22 14:10:54.906+01	2026-04-22 14:10:54.906+01	101
604	\N	270614360	0.50	\N	\N	\N	\N	\N	2026-04-22 14:10:54.909+01	2026-04-22 14:10:54.909+01	101
605	\N	270617330	1.00	\N	\N	\N	\N	\N	2026-04-22 14:10:54.911+01	2026-04-22 14:10:54.911+01	101
606	\N	270617330	1.50	\N	\N	\N	\N	\N	2026-04-22 14:10:54.914+01	2026-04-22 14:10:54.914+01	101
607	3-1447221-3	270613320	0.75	\N	3,5 à 4,5	≥ 90	\N	\N	2026-04-22 14:10:54.917+01	2026-04-22 14:10:54.917+01	102
608	3-1447221-3	270613320	0.85	\N	3,5 à 4,5	≥ 110	\N	\N	2026-04-22 14:10:54.92+01	2026-04-22 14:10:54.92+01	102
609	3-1447221-3	270613320	1.25	\N	3,5 à 4,5	\N	\N	\N	2026-04-22 14:10:54.932+01	2026-04-22 14:10:54.932+01	102
610	76347-301LF	270614750	0.35	\N	2,75 à 3,25	\N	\N	\N	2026-04-22 14:10:54.935+01	2026-04-22 14:10:54.935+01	103
611	76347-301LF	270614750	0.50	\N	2,75 à 3,25	\N	\N	\N	2026-04-22 14:10:54.937+01	2026-04-22 14:10:54.937+01	103
612	76347-301LF	270614750	\N	\N	2,75 à 3,25	\N	\N	\N	2026-04-22 14:10:54.939+01	2026-04-22 14:10:54.939+01	103
613	64322-1039	270616670	0.50	\N	3,4 à 3,6	≥ 70	\N	manque cosse 270617050	2026-04-22 14:10:54.942+01	2026-04-22 14:10:54.942+01	104
614	64322-1039	270616670	0.75	\N	3,4 à 3,6	≥ 90	\N	\N	2026-04-22 14:10:54.944+01	2026-04-22 14:10:54.944+01	104
615	64322-1039	270617050	\N	\N	3,4 à 3,6	\N	\N	\N	2026-04-22 14:10:54.946+01	2026-04-22 14:10:54.946+01	104
616	64323-1029	270616680	0.50	\N	4.5	≥ 70	\N	\N	2026-04-22 14:10:54.948+01	2026-04-22 14:10:54.948+01	105
617	64323-1029	270616680	0.75	\N	4.5	≥ 90	\N	\N	2026-04-22 14:10:54.95+01	2026-04-22 14:10:54.95+01	105
618	64323-1029	270616680	1.00	\N	4.5	≥ 115	\N	\N	2026-04-22 14:10:54.951+01	2026-04-22 14:10:54.951+01	105
619	10757690	270616200	0.50	\N	\N	≥ 75	\N	cosse -50 pieces	2026-04-22 14:10:54.959+01	2026-04-22 14:10:54.959+01	108
620	10757690	270616200	0.75	\N	\N	≥ 120	\N	\N	2026-04-22 14:10:54.96+01	2026-04-22 14:10:54.96+01	108
621	10757690	270616200	1.00	\N	\N	≥ 160	\N	\N	2026-04-22 14:10:54.961+01	2026-04-22 14:10:54.961+01	108
622	13627884	270616220	0.35	\N	4.6	≥ 50	\N	\N	2026-04-22 14:10:54.963+01	2026-04-22 14:10:54.963+01	109
623	13627884	270616220	0.50	\N	4.6	≥ 75	\N	\N	2026-04-22 14:10:54.964+01	2026-04-22 14:10:54.964+01	109
624	\N	270616780	0.75	\N	\N	\N	\N	\N	2026-04-22 14:10:54.967+01	2026-04-22 14:10:54.967+01	110
625	\N	270616780	1.50	\N	\N	\N	\N	\N	2026-04-22 14:10:54.969+01	2026-04-22 14:10:54.969+01	110
626	\N	270616820	0.50	\N	\N	\N	\N	\N	2026-04-22 14:10:54.974+01	2026-04-22 14:10:54.974+01	112
627	\N	270616820	0.75	\N	\N	\N	\N	\N	2026-04-22 14:10:54.977+01	2026-04-22 14:10:54.977+01	112
628	64324-1049	270617070	0.50	\N	4,9 à 5,1	≥ 70	\N	\N	2026-04-22 14:10:54.988+01	2026-04-22 14:10:54.988+01	116
629	64324-1049	270617070	0.75	\N	4,9 à 5,1	≥ 90	\N	\N	2026-04-22 14:10:54.992+01	2026-04-22 14:10:54.992+01	116
630	64324-1049	270617070	1.00	\N	4,9 à 5,1	≥ 115	\N	\N	2026-04-22 14:10:54.994+01	2026-04-22 14:10:54.994+01	116
631	\N	270608150	\N	\N	\N	\N	\N	manque cosse	2026-04-22 14:10:54.998+01	2026-04-22 14:10:54.998+01	118
632	\N	270608480	1.00	\N	\N	\N	\N	\N	2026-04-22 14:10:54.999+01	2026-04-22 14:10:54.999+01	118
633	\N	270599130	1.50	\N	\N	\N	\N	\N	2026-04-22 14:10:55.001+01	2026-04-22 14:10:55.001+01	118
634	\N	23002468	0.34	\N	\N	68	\N	\N	2026-04-22 14:10:55.006+01	2026-04-22 14:10:55.006+01	120
635	\N	270567620	\N	\N	\N	\N	\N	manque cosse	2026-04-22 14:10:55.013+01	2026-04-22 14:10:55.013+01	122
636	\N	270567620	\N	\N	\N	\N	\N	\N	2026-04-22 14:10:55.013+01	2026-04-22 14:10:55.013+01	122
637	\N	270599130	\N	\N	\N	\N	\N	\N	2026-04-22 14:10:55.014+01	2026-04-22 14:10:55.014+01	122
638	\N	270608150	\N	\N	\N	\N	\N	manque cosse	2026-04-22 14:10:55.016+01	2026-04-22 14:10:55.016+01	122
639	SPH-002T-P0.5S	270567800	0.05	\N	\N	\N	\N	manque cosse	2026-04-22 14:10:55.02+01	2026-04-22 14:10:55.02+01	124
640	SPH-002T-P0.5S	270567800	0.08	\N	\N	\N	\N	\N	2026-04-22 14:10:55.021+01	2026-04-22 14:10:55.021+01	124
641	SPH-002T-P0.5S	270567800	0.12	\N	\N	≥ 13	\N	\N	2026-04-22 14:10:55.022+01	2026-04-22 14:10:55.022+01	124
642	SPH-002T-P0.5S	270567800	0.22	\N	\N	≥ 22	\N	\N	2026-04-22 14:10:55.023+01	2026-04-22 14:10:55.023+01	124
643	08-70-1031	92393330	\N	\N	\N	\N	\N	\N	2026-04-22 14:10:55.028+01	2026-04-22 14:10:55.028+01	126
644	08-70-1031	923922200	\N	\N	3 à 3,5	≥ 88,2	\N	\N	2026-04-22 14:10:55.028+01	2026-04-22 14:10:55.028+01	126
645	08-70-1031	923922200	\N	\N	3 à 3,5	≥ 58,8	\N	\N	2026-04-22 14:10:55.029+01	2026-04-22 14:10:55.029+01	126
646	08-70-1031	923922200	\N	\N	3 à 3,5	≥ 39,2	\N	\N	2026-04-22 14:10:55.03+01	2026-04-22 14:10:55.03+01	126
647	08-70-1031	923922200	\N	\N	3 à 3,5	≥ 29,4	\N	\N	2026-04-22 14:10:55.031+01	2026-04-22 14:10:55.031+01	126
648	\N	270622840	\N	\N	\N	\N	\N	manque cosse	2026-04-22 14:10:55.036+01	2026-04-22 14:10:55.036+01	128
649	64324-1029	270622710	2.50	\N	4,9 à 5,1	≥ 235	\N	manque cosse	2026-04-22 14:10:55.038+01	2026-04-22 14:10:55.038+01	129
650	64324-1029	270622710	3.00	\N	4,9 à 5,1	≥ 260	\N	\N	2026-04-22 14:10:55.04+01	2026-04-22 14:10:55.04+01	129
651	64324-1039	270617150	1.50	\N	4,9 à 5,1	≥ 155	\N	manque cosse	2026-04-22 14:10:55.043+01	2026-04-22 14:10:55.043+01	130
652	64324-1039	270617150	2.00	\N	4,9 à 5,1	≥ 195	\N	\N	2026-04-22 14:10:55.044+01	2026-04-22 14:10:55.044+01	130
653	64323-1039	270617060	1.50	\N	4.5	≥ 155	\N	manque cosse	2026-04-22 14:10:55.046+01	2026-04-22 14:10:55.046+01	131
654	64323-1039	270617060	2.00	\N	4.5	≥ 195	\N	\N	2026-04-22 14:10:55.047+01	2026-04-22 14:10:55.047+01	131
655	0151081-20-1G	923927200	0.50	\N	7	≥ 60	\N	\N	2026-04-22 14:10:55.049+01	2026-04-22 14:10:55.049+01	132
656	0151081-20-1G	923927200	0.75	\N	7	\N	\N	\N	2026-04-22 14:10:55.05+01	2026-04-22 14:10:55.05+01	132
657	0151081-20-1G	923927200	1.00	\N	7	\N	\N	\N	2026-04-22 14:10:55.051+01	2026-04-22 14:10:55.051+01	132
658	0151081-20-1G	923927200	1.50	\N	7	\N	\N	\N	2026-04-22 14:10:55.051+01	2026-04-22 14:10:55.051+01	132
659	0151081-20-1G	923927200	2.50	\N	7	\N	\N	\N	2026-04-22 14:10:55.052+01	2026-04-22 14:10:55.052+01	132
660	43030-0010	270619860	0.05	\N	2,54 à 2,92	≥ 6,6	\N	cosse -50 pieces	2026-04-22 14:10:55.055+01	2026-04-22 14:10:55.055+01	133
661	43030-0010	270619860	0.08	\N	2,54 à 2,92	≥ 8,9	\N	\N	2026-04-22 14:10:55.056+01	2026-04-22 14:10:55.056+01	133
662	43030-0010	270619860	0.12	\N	2,54 à 2,92	≥ 13,3	\N	\N	2026-04-22 14:10:55.057+01	2026-04-22 14:10:55.057+01	133
663	43030-0001	270624420	0.20	\N	2,54 à 2,92	≥ 22,2	\N	\N	2026-04-22 14:10:55.058+01	2026-04-22 14:10:55.058+01	133
664	43030-0001	270624420	0.34	\N	2,54 à 2,92	≥ 35,6	\N	\N	2026-04-22 14:10:55.059+01	2026-04-22 14:10:55.059+01	133
665	43030-0001	270624420	0.50	\N	2,54 à 2,92	≥ 57,8	\N	\N	2026-04-22 14:10:55.061+01	2026-04-22 14:10:55.061+01	133
666	43030-0008	270568030	0.20	\N	2,54 à 2,92	≥ 22,2	\N	manque cosse	2026-04-22 14:10:55.063+01	2026-04-22 14:10:55.063+01	133
667	43030-0008	270568030	0.34	\N	2,54 à 2,92	≥ 35,6	\N	\N	2026-04-22 14:10:55.063+01	2026-04-22 14:10:55.063+01	133
668	43030-0008	270568030	0.50	\N	2,54 à 2,92	≥ 57,8	\N	\N	2026-04-22 14:10:55.064+01	2026-04-22 14:10:55.064+01	133
669	43031-0001	270624410	0.20	\N	2,54 à 2,92	≥ 22,2	\N	manque cosse	2026-04-22 14:10:55.065+01	2026-04-22 14:10:55.065+01	133
670	43031-0001	270624410	0.34	\N	2,54 à 2,92	≥ 35,6	\N	\N	2026-04-22 14:10:55.066+01	2026-04-22 14:10:55.066+01	133
671	43031-0001	270624410	0.50	\N	2,54 à 2,92	≥ 57,8	\N	\N	2026-04-22 14:10:55.066+01	2026-04-22 14:10:55.066+01	133
672	43031-0007	270624430	0.20	\N	2,54 à 2,92	≥ 22,2	\N	\N	2026-04-22 14:10:55.067+01	2026-04-22 14:10:55.067+01	133
673	43031-0007	270624430	0.34	\N	2,54 à 2,92	≥ 35,6	\N	\N	2026-04-22 14:10:55.068+01	2026-04-22 14:10:55.068+01	133
674	43031-0007	270624430	0.50	\N	2,54 à 2,92	≥ 57,8	\N	\N	2026-04-22 14:10:55.07+01	2026-04-22 14:10:55.07+01	133
675	VN0201600021	270626480	0.50	\N	3,5 a 4,5	75	\N	\N	2026-04-22 14:10:55.073+01	2026-04-22 14:10:55.073+01	134
676	VN0201600021	270626480	1.00	\N	3,5 a 4,5	150	\N	\N	2026-04-22 14:10:55.075+01	2026-04-22 14:10:55.075+01	134
677	VN0201600021	270626480	1.50	\N	3,5 a 4,5	220	\N	\N	2026-04-22 14:10:55.076+01	2026-04-22 14:10:55.076+01	134
678	SPH-002T-P0.5S	270567800	0.05	\N	\N	\N	\N	\N	2026-04-22 14:10:55.078+01	2026-04-22 14:10:55.078+01	135
679	SPH-002T-P0.5S	270567800	0.08	\N	\N	\N	\N	verefication visuelle	2026-04-22 14:10:55.079+01	2026-04-22 14:10:55.079+01	135
680	SPH-002T-P0.5S	270567800	0.12	\N	\N	≥ 13	\N	cosse -50 pieces	2026-04-22 14:10:55.08+01	2026-04-22 14:10:55.08+01	135
681	SPH-002T-P0.5S	270567800	0.22	\N	\N	≥ 22	\N	\N	2026-04-22 14:10:55.08+01	2026-04-22 14:10:55.08+01	135
682	0462-203-04141	270613240	13.00	\N	10,92 à 12,50	≥ 1334	\N	\N	2026-04-22 14:10:55.084+01	2026-04-22 14:10:55.084+01	137
683	0460-204-0490	270613240	13.00	\N	10,92 à 12,50	≥ 1330	\N	\N	2026-04-22 14:10:55.085+01	2026-04-22 14:10:55.085+01	137
684	0462-203-08141	270567074	5.00	\N	10,92 à 12,50	≥ 400	\N	\N	2026-04-22 14:10:55.086+01	2026-04-22 14:10:55.086+01	137
685	0462-203-08141	270567074	8.00	\N	10,92 à 12,50	≥ 556	\N	\N	2026-04-22 14:10:55.087+01	2026-04-22 14:10:55.087+01	137
686	0462-203-08141	270567046	5.00	\N	10,92 à 12,50	≥ 400	\N	\N	2026-04-22 14:10:55.087+01	2026-04-22 14:10:55.087+01	137
687	0462-203-08141	270567046	8.00	\N	10,92 à 12,50	≥ 556	\N	\N	2026-04-22 14:10:55.088+01	2026-04-22 14:10:55.088+01	137
\.


--
-- TOC entry 5701 (class 0 OID 24720)
-- Dependencies: 252
-- Data for Name: pinces; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.pinces (id, numero_pince, reference_pince, date_verification, statut, remarque, "createdAt", "updatedAt", fabricant_id) FROM stdin;
1	P01+P02	539 773-2A	2025-05-05	À vérifier	\N	2026-04-22 14:10:53.831+01	2026-04-22 14:10:53.831+01	38
2	P3	S16SCML1	2025-05-05	À vérifier	\N	2026-04-22 14:10:53.876+01	2026-04-22 14:10:53.876+01	36
3	P4	M317 + TP1024	\N	À vérifier	cosse 270609280 -50 pieces	2026-04-22 14:10:53.901+01	2026-04-22 14:10:53.901+01	37
4	P5	58529-2	2025-05-05	À vérifier	\N	2026-04-22 14:10:53.91+01	2026-04-22 14:10:53.91+01	38
5	P6	G1GEG454	2025-05-05	À vérifier	\N	2026-04-22 14:10:53.921+01	2026-04-22 14:10:53.921+01	39
6	P7	539 737-2/A	2025-05-05	À vérifier	\N	2026-04-22 14:10:53.947+01	2026-04-22 14:10:53.947+01	38
7	P8	GM12014254	5025-05-06	À vérifier	\N	2026-04-22 14:10:53.981+01	2026-04-22 14:10:53.981+01	40
8	P9	97 33 02	2025-05-06	À vérifier	\N	2026-04-22 14:10:54+01	2026-04-22 14:10:54+01	41
9	P11	9040450000	2025-05-06	À vérifier	\N	2026-04-22 14:10:54.013+01	2026-04-22 14:10:54.013+01	42
10	P12	904054	\N	À vérifier	\N	2026-04-22 14:10:54.031+01	2026-04-22 14:10:54.031+01	42
11	P13		2025-05-06	Vérification visuelle	verefication visuelle	2026-04-22 14:10:54.033+01	2026-04-22 14:10:54.033+01	57
12	P14	9011460000	2025-05-06	Vérification visuelle	verefication visuelle	2026-04-22 14:10:54.035+01	2026-04-22 14:10:54.035+01	42
13	P15	PZ6/5901146	2025-05-06	Vérification visuelle	verefication visuelle	2026-04-22 14:10:54.038+01	2026-04-22 14:10:54.038+01	42
14	P16	638118200P	\N	À vérifier	\N	2026-04-22 14:10:54.042+01	2026-04-22 14:10:54.042+01	45
15	P17	63819-0900	2025-05-07	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.045+01	2026-04-22 14:10:54.045+01	45
16	P18	WC-JWPF	\N	À vérifier	TEC	2026-04-22 14:10:54.062+01	2026-04-22 14:10:54.062+01	46
17	P19	539 773-2/A	\N	À vérifier	\N	2026-04-22 14:10:54.069+01	2026-04-22 14:10:54.069+01	39
18	P20	CAGE11851	\N	À vérifier	\N	2026-04-22 14:10:54.082+01	2026-04-22 14:10:54.082+01	38
19	P21		\N	À vérifier	\N	2026-04-22 14:10:54.097+01	2026-04-22 14:10:54.097+01	57
20	P22	S16SCML1	\N	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.11+01	2026-04-22 14:10:54.11+01	37
21	P23	1864-28100	\N	À vérifier	cosse 270606810- 50 pieces	2026-04-22 14:10:54.112+01	2026-04-22 14:10:54.112+01	37
22	P24	1864-28100	\N	À vérifier	\N	2026-04-22 14:10:54.116+01	2026-04-22 14:10:54.116+01	36
23	P25	HDT-48-00	\N	À vérifier	\N	2026-04-22 14:10:54.131+01	2026-04-22 14:10:54.131+01	39
24	P27	539 737-2/A	\N	À vérifier	\N	2026-04-22 14:10:54.151+01	2026-04-22 14:10:54.151+01	57
25	P28+P29	91592-1	2025-04-14	À vérifier	\N	2026-04-22 14:10:54.163+01	2026-04-22 14:10:54.163+01	40
26	P30	91583-1	\N	Manque cosse	manque cosse	2026-04-22 14:10:54.18+01	2026-04-22 14:10:54.18+01	47
27	P31	S16SCM20	\N	À vérifier	\N	2026-04-22 14:10:54.189+01	2026-04-22 14:10:54.189+01	38
28	P32	91505-1	\N	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.215+01	2026-04-22 14:10:54.215+01	38
29	P33	WC-691	\N	À vérifier	\N	2026-04-22 14:10:54.242+01	2026-04-22 14:10:54.242+01	38
30	P34	C113007/4809	2025-05-07	Manque cosse	manque cosse	2026-04-22 14:10:54.246+01	2026-04-22 14:10:54.246+01	38
31	P35	A51673	\N	À vérifier	\N	2026-04-22 14:10:54.261+01	2026-04-22 14:10:54.261+01	39
32	P36	A510600	\N	À vérifier	\N	2026-04-22 14:10:54.272+01	2026-04-22 14:10:54.272+01	39
33	P37	58606-2	\N	Manque cosse	manque cosse	2026-04-22 14:10:54.283+01	2026-04-22 14:10:54.283+01	38
34	P38	071/918	2025-05-12	À vérifier	\N	2026-04-22 14:10:54.287+01	2026-04-22 14:10:54.287+01	38
35	P39	916039	2025-05-12	À vérifier	\N	2026-04-22 14:10:54.299+01	2026-04-22 14:10:54.299+01	36
36	P40	5-1579001-1/A	2025-05-12	À vérifier	\N	2026-04-22 14:10:54.304+01	2026-04-22 14:10:54.304+01	38
37	P42	CAGE11851	2025-05-12	À vérifier	\N	2026-04-22 14:10:54.33+01	2026-04-22 14:10:54.33+01	57
38	P43	539 663-2/A	2025-05-12	À vérifier	\N	2026-04-22 14:10:54.336+01	2026-04-22 14:10:54.336+01	39
39	P44	539 950-2/A	2025-05-20	À vérifier	\N	2026-04-22 14:10:54.352+01	2026-04-22 14:10:54.352+01	39
40	P45	5-1579001-3/A	\N	À vérifier	\N	2026-04-22 14:10:54.367+01	2026-04-22 14:10:54.367+01	42
41	P46	539 727-2/A	\N	À vérifier	\N	2026-04-22 14:10:54.369+01	2026-04-22 14:10:54.369+01	42
42	P47	539 758-2/A	\N	À vérifier	\N	2026-04-22 14:10:54.371+01	2026-04-22 14:10:54.371+01	57
43	P48	539 726-2/A	\N	À vérifier	\N	2026-04-22 14:10:54.373+01	2026-04-22 14:10:54.373+01	41
44	P49	3-1579021-7/A	2025-05-19	À vérifier	\N	2026-04-22 14:10:54.382+01	2026-04-22 14:10:54.382+01	38
45	P50	66-0003-001	2025-05-19	À vérifier	\N	2026-04-22 14:10:54.413+01	2026-04-22 14:10:54.413+01	48
46	P51		\N	À vérifier	\N	2026-04-22 14:10:54.43+01	2026-04-22 14:10:54.43+01	39
47	P52	916039	2025-05-19	À vérifier	\N	2026-04-22 14:10:54.441+01	2026-04-22 14:10:54.441+01	39
48	P53	5-1579001-1/A	\N	Manque cosse	manque cosse	2026-04-22 14:10:54.499+01	2026-04-22 14:10:54.499+01	57
49	P54	91594-1	\N	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.527+01	2026-04-22 14:10:54.527+01	38
50	P55	CAGE11851	\N	À vérifier	\N	2026-04-22 14:10:54.542+01	2026-04-22 14:10:54.542+01	37
51	P56		\N	À vérifier	\N	2026-04-22 14:10:54.553+01	2026-04-22 14:10:54.553+01	39
52	P57	539 663-2/A	2025-05-19	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.568+01	2026-04-22 14:10:54.568+01	38
53	P58	539 950-2/A	2025-05-20	Manque cosse	manque cosse	2026-04-22 14:10:54.583+01	2026-04-22 14:10:54.583+01	38
54	P59	5-1579001-3/A	2025-05-20	À vérifier	\N	2026-04-22 14:10:54.598+01	2026-04-22 14:10:54.598+01	38
55	P60	539 727-2/A	2025-05-20	À vérifier	\N	2026-04-22 14:10:54.604+01	2026-04-22 14:10:54.604+01	38
56	P61	539 758-2/A	2025-05-20	Manque cosse	manque cosse	2026-04-22 14:10:54.616+01	2026-04-22 14:10:54.616+01	38
57	P62	539 726-2/A	2025-05-21	À vérifier	\N	2026-04-22 14:10:54.631+01	2026-04-22 14:10:54.631+01	38
58	P63	3-1579021-7/A	2025-05-21	À vérifier	\N	2026-04-22 14:10:54.637+01	2026-04-22 14:10:54.637+01	38
59	P64		\N	À vérifier	\N	2026-04-22 14:10:54.646+01	2026-04-22 14:10:54.646+01	41
60	P65	1864-28100	2025-05-21	À vérifier	\N	2026-04-22 14:10:54.648+01	2026-04-22 14:10:54.648+01	47
61	P66		2025-05-21	Vérification visuelle	verefication visuelle	2026-04-22 14:10:54.653+01	2026-04-22 14:10:54.653+01	42
62	P66-1		2025-05-21	Vérification visuelle	verefication visuelle	2026-04-22 14:10:54.655+01	2026-04-22 14:10:54.655+01	42
63	P67	459	2025-05-21	Vérification visuelle	verefication visuelle	2026-04-22 14:10:54.658+01	2026-04-22 14:10:54.658+01	41
64	P68		\N	À vérifier	\N	2026-04-22 14:10:54.661+01	2026-04-22 14:10:54.661+01	49
65	P69		\N	À vérifier	\N	2026-04-22 14:10:54.662+01	2026-04-22 14:10:54.662+01	39
66	P70	539 651-2/A	2025-05-26	À vérifier	\N	2026-04-22 14:10:54.666+01	2026-04-22 14:10:54.666+01	38
67	P71	X116996	2025-05-26	À vérifier	\N	2026-04-22 14:10:54.672+01	2026-04-22 14:10:54.672+01	46
68	P72		\N	Manque cosse	manque cosse	2026-04-22 14:10:54.679+01	2026-04-22 14:10:54.679+01	46
69	P73		\N	Manque cosse	manque cosse	2026-04-22 14:10:54.681+01	2026-04-22 14:10:54.681+01	46
70	P74+P75	DTT-12-00	2025-05-26	À vérifier	\N	2026-04-22 14:10:54.686+01	2026-04-22 14:10:54.686+01	39
71	P76	539 679-2/B	2025-05-26	À vérifier	\N	2026-04-22 14:10:54.698+01	2026-04-22 14:10:54.698+01	38
72	P77		\N	À vérifier	\N	2026-04-22 14:10:54.711+01	2026-04-22 14:10:54.711+01	57
73	P78	91522-1	\N	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.712+01	2026-04-22 14:10:54.712+01	38
74	P79	1579024-3	2025-05-26	À vérifier	\N	2026-04-22 14:10:54.716+01	2026-04-22 14:10:54.716+01	38
75	P80	438-521	2025-05-26	À vérifier	\N	2026-04-22 14:10:54.739+01	2026-04-22 14:10:54.739+01	39
76	P81	609	2025-05-26	À vérifier	\N	2026-04-22 14:10:54.747+01	2026-04-22 14:10:54.747+01	39
77	P82	1622	\N	À vérifier	\N	2026-04-22 14:10:54.763+01	2026-04-22 14:10:54.763+01	50
78	P83	1623MFX-3954	2025-04-15	À vérifier	\N	2026-04-22 14:10:54.765+01	2026-04-22 14:10:54.765+01	50
79	P84		\N	À vérifier	\N	2026-04-22 14:10:54.776+01	2026-04-22 14:10:54.776+01	57
80	P85	539 955-2/A	2025-05-26	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.781+01	2026-04-22 14:10:54.781+01	38
81	P86	539 757-2/A	2025-05-27	À vérifier	\N	2026-04-22 14:10:54.787+01	2026-04-22 14:10:54.787+01	38
82	P87	15S3F178060103	5025-05-15	À vérifier	\N	2026-04-22 14:10:54.796+01	2026-04-22 14:10:54.796+01	51
83	P88	13782656	2025-04-15	À vérifier	\N	2026-04-22 14:10:54.803+01	2026-04-22 14:10:54.803+01	40
84	P89	28S3F178061102	2025-05-26	À vérifier	\N	2026-04-22 14:10:54.811+01	2026-04-22 14:10:54.811+01	51
85	P90	1454509-2	2025-05-27	À vérifier	\N	2026-04-22 14:10:54.816+01	2026-04-22 14:10:54.816+01	38
86	P91	15S3F178060103	2025-05-27	À vérifier	\N	2026-04-22 14:10:54.82+01	2026-04-22 14:10:54.82+01	51
87	P92	4-1579001-7/C	\N	À vérifier	\N	2026-04-22 14:10:54.829+01	2026-04-22 14:10:54.829+01	38
88	P93	28S3F178061103	2025-05-28	À vérifier	cosse 270613340 -50 pieces	2026-04-22 14:10:54.831+01	2026-04-22 14:10:54.831+01	51
89	P94	13782683	\N	À vérifier	\N	2026-04-22 14:10:54.839+01	2026-04-22 14:10:54.839+01	40
90	P95	4-1579001-6/C	\N	Manque cosse	manque cosse	2026-04-22 14:10:54.842+01	2026-04-22 14:10:54.842+01	38
91	P96	121586-5237	2025-05-31	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.847+01	2026-04-22 14:10:54.847+01	52
92	P97	58628-2	2025-05-31	À vérifier	\N	2026-04-22 14:10:54.854+01	2026-04-22 14:10:54.854+01	38
93	P98		\N	À vérifier	\N	2026-04-22 14:10:54.861+01	2026-04-22 14:10:54.861+01	57
94	P99	58421-2	\N	Manque cosse	manque cosse	2026-04-22 14:10:54.863+01	2026-04-22 14:10:54.863+01	38
95	P100		2025-05-31	À vérifier	270607660 cossse manquer	2026-04-22 14:10:54.867+01	2026-04-22 14:10:54.867+01	42
96	P101	155089-1-A	\N	Manque cosse	manque cosse	2026-04-22 14:10:54.884+01	2026-04-22 14:10:54.884+01	53
97	P102	WC-260	2025-06-01	À vérifier	\N	2026-04-22 14:10:54.886+01	2026-04-22 14:10:54.886+01	46
98	P103	758	2025-09-09	Manque cosse	manque cosse	2026-04-22 14:10:54.893+01	2026-04-22 14:10:54.893+01	38
99	P104	4-1579001-1/A	\N	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.899+01	2026-04-22 14:10:54.899+01	38
100	P105	G1145037	\N	À vérifier	\N	2026-04-22 14:10:54.902+01	2026-04-22 14:10:54.902+01	38
101	P106	F745266	2025-06-02	À vérifier	\N	2026-04-22 14:10:54.904+01	2026-04-22 14:10:54.904+01	50
102	P107	A1831	2025-06-02	À vérifier	\N	2026-04-22 14:10:54.916+01	2026-04-22 14:10:54.916+01	38
103	P108	HT-8656-3005	2025-06-02	À vérifier	\N	2026-04-22 14:10:54.934+01	2026-04-22 14:10:54.934+01	50
104	P109	ES13888	2025-06-02	Manque cosse	manque cosse 270617050	2026-04-22 14:10:54.94+01	2026-04-22 14:10:54.94+01	45
105	P110	ES77322	2025-06-02	À vérifier	\N	2026-04-22 14:10:54.947+01	2026-04-22 14:10:54.947+01	45
106	P111		\N	À vérifier	\N	2026-04-22 14:10:54.953+01	2026-04-22 14:10:54.953+01	40
107	P112	91337-2	\N	Manque cosse	manque cosse	2026-04-22 14:10:54.954+01	2026-04-22 14:10:54.954+01	38
108	P113		\N	À vérifier	cosse -50 pieces	2026-04-22 14:10:54.957+01	2026-04-22 14:10:54.957+01	40
109	P114	13782705	\N	À vérifier	\N	2026-04-22 14:10:54.962+01	2026-04-22 14:10:54.962+01	40
110	P115	2119118-2	2025-06-03	À vérifier	\N	2026-04-22 14:10:54.966+01	2026-04-22 14:10:54.966+01	38
111	P116	63811-6170	\N	Manque cosse	manque cosse	2026-04-22 14:10:54.971+01	2026-04-22 14:10:54.971+01	45
112	P117	63811-6200	2025-06-03	À vérifier	\N	2026-04-22 14:10:54.973+01	2026-04-22 14:10:54.973+01	45
113	P118		\N	Manque cosse	manque cosse	2026-04-22 14:10:54.981+01	2026-04-22 14:10:54.981+01	46
114	P119		\N	Manque cosse	manque cosse	2026-04-22 14:10:54.984+01	2026-04-22 14:10:54.984+01	42
115	P120		\N	Manque cosse	manque cosse	2026-04-22 14:10:54.986+01	2026-04-22 14:10:54.986+01	42
116	P121	63819-3470	2025-06-03	À vérifier	\N	2026-04-22 14:10:54.987+01	2026-04-22 14:10:54.987+01	45
117	P122		\N	À vérifier	\N	2026-04-22 14:10:54.996+01	2026-04-22 14:10:54.996+01	38
118	P123		2025-06-03	Manque cosse	manque cosse	2026-04-22 14:10:54.997+01	2026-04-22 14:10:54.997+01	57
119	P124	63827-9570	\N	À vérifier	\N	2026-04-22 14:10:55.003+01	2026-04-22 14:10:55.003+01	45
120	P125 BIS		2025-06-03	À vérifier	\N	2026-04-22 14:10:55.005+01	2026-04-22 14:10:55.005+01	57
121	P125		\N	Manque cosse	manque cosse	2026-04-22 14:10:55.01+01	2026-04-22 14:10:55.01+01	49
122	P126	071/123	2025-06-03	Manque cosse	manque cosse	2026-04-22 14:10:55.011+01	2026-04-22 14:10:55.011+01	48
123	P127	638190800D	\N	À vérifier	\N	2026-04-22 14:10:55.017+01	2026-04-22 14:10:55.017+01	45
124	P128	SPH-00T-P05S	\N	Manque cosse	manque cosse	2026-04-22 14:10:55.019+01	2026-04-22 14:10:55.019+01	46
125	P129	638118200F	\N	À vérifier	\N	2026-04-22 14:10:55.025+01	2026-04-22 14:10:55.025+01	45
126	P130	63811-6500	\N	À vérifier	\N	2026-04-22 14:10:55.026+01	2026-04-22 14:10:55.026+01	45
127	P131	539 663-2/A	\N	À vérifier	\N	2026-04-22 14:10:55.033+01	2026-04-22 14:10:55.033+01	38
128	P132	H546970922119	\N	Manque cosse	manque cosse	2026-04-22 14:10:55.035+01	2026-04-22 14:10:55.035+01	45
129	P133	63811-6870	\N	Manque cosse	manque cosse	2026-04-22 14:10:55.037+01	2026-04-22 14:10:55.037+01	45
130	P134	63811-9770	\N	Manque cosse	manque cosse	2026-04-22 14:10:55.042+01	2026-04-22 14:10:55.042+01	45
131	P135	J416137	\N	Manque cosse	manque cosse	2026-04-22 14:10:55.045+01	2026-04-22 14:10:55.045+01	45
132	P136	M22520/1-02	\N	À vérifier	\N	2026-04-22 14:10:55.048+01	2026-04-22 14:10:55.048+01	57
133	P137	638190000G	2024-10-13	À vérifier	cosse -50 pieces	2026-04-22 14:10:55.053+01	2026-04-22 14:10:55.053+01	57
134	P138	L470459	2025-07-09	À vérifier	\N	2026-04-22 14:10:55.072+01	2026-04-22 14:10:55.072+01	50
135	P200	SPH002T-P05s	2024-10-13	À vérifier	\N	2026-04-22 14:10:55.077+01	2026-04-22 14:10:55.077+01	46
136	P210		\N	À vérifier	\N	2026-04-22 14:10:55.082+01	2026-04-22 14:10:55.082+01	42
137	P340		\N	À vérifier	\N	2026-04-22 14:10:55.083+01	2026-04-22 14:10:55.083+01	57
\.


--
-- TOC entry 5703 (class 0 OID 24727)
-- Dependencies: 254
-- Data for Name: zones; Type: TABLE DATA; Schema: public; Owner: webrai_user
--

COPY public.zones (id, nom_zone, localisation) FROM stdin;
1	Bobinage	Atelier A
2	Câblage	Atelier B
3	Assemblage Électro-Mécanique	Atelier C
4	Électronique	Atelier D
5	Électro-aimant	Atelier E
6	Embases Relais	Atelier F
7	Kuhn	Atelier G
8	Maintenance	Atelier H
9	Chauvin Arnoux	Labo Étalonnage
10	Club	Atelier I
\.


--
-- TOC entry 5789 (class 0 OID 0)
-- Dependencies: 234
-- Name: applicateur_maintenance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.applicateur_maintenance_records_id_seq', 1, false);


--
-- TOC entry 5790 (class 0 OID 0)
-- Dependencies: 262
-- Name: applicateur_thresholds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.applicateur_thresholds_id_seq', 378, true);


--
-- TOC entry 5791 (class 0 OID 0)
-- Dependencies: 236
-- Name: applicateur_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.applicateur_variants_id_seq', 187, true);


--
-- TOC entry 5792 (class 0 OID 0)
-- Dependencies: 238
-- Name: applicateurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.applicateurs_id_seq', 213, true);


--
-- TOC entry 5793 (class 0 OID 0)
-- Dependencies: 261
-- Name: cosses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.cosses_id_seq', 653, true);


--
-- TOC entry 5794 (class 0 OID 0)
-- Dependencies: 264
-- Name: curative_maintenance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.curative_maintenance_records_id_seq', 20, true);


--
-- TOC entry 5795 (class 0 OID 0)
-- Dependencies: 241
-- Name: ecme_interventions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.ecme_interventions_id_seq', 6400, true);


--
-- TOC entry 5796 (class 0 OID 0)
-- Dependencies: 243
-- Name: equipements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.equipements_id_seq', 325, true);


--
-- TOC entry 5797 (class 0 OID 0)
-- Dependencies: 245
-- Name: fabricants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.fabricants_id_seq', 72, true);


--
-- TOC entry 5798 (class 0 OID 0)
-- Dependencies: 247
-- Name: maintenance_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.maintenance_events_id_seq', 15, true);


--
-- TOC entry 5799 (class 0 OID 0)
-- Dependencies: 256
-- Name: maintenance_sheets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.maintenance_sheets_id_seq', 3, true);


--
-- TOC entry 5800 (class 0 OID 0)
-- Dependencies: 249
-- Name: pince_maintenance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.pince_maintenance_records_id_seq', 177, true);


--
-- TOC entry 5801 (class 0 OID 0)
-- Dependencies: 258
-- Name: pince_preventive_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.pince_preventive_records_id_seq', 220, true);


--
-- TOC entry 5802 (class 0 OID 0)
-- Dependencies: 251
-- Name: pince_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.pince_variants_id_seq', 690, true);


--
-- TOC entry 5803 (class 0 OID 0)
-- Dependencies: 253
-- Name: pinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.pinces_id_seq', 140, true);


--
-- TOC entry 5804 (class 0 OID 0)
-- Dependencies: 255
-- Name: zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: webrai_user
--

SELECT pg_catalog.setval('public.zones_id_seq', 10, true);


--
-- TOC entry 4801 (class 2606 OID 24743)
-- Name: applicateur_maintenance_records applicateur_maintenance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateur_maintenance_records
    ADD CONSTRAINT applicateur_maintenance_records_pkey PRIMARY KEY (id);


--
-- TOC entry 5524 (class 2606 OID 43798)
-- Name: applicateur_thresholds applicateur_thresholds_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateur_thresholds
    ADD CONSTRAINT applicateur_thresholds_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 24745)
-- Name: applicateur_variants applicateur_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateur_variants
    ADD CONSTRAINT applicateur_variants_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 24747)
-- Name: applicateurs applicateurs_numero_outil_key; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateurs
    ADD CONSTRAINT applicateurs_numero_outil_key UNIQUE (numero_outil);


--
-- TOC entry 4807 (class 2606 OID 24749)
-- Name: applicateurs applicateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateurs
    ADD CONSTRAINT applicateurs_pkey PRIMARY KEY (id);


--
-- TOC entry 5522 (class 2606 OID 41671)
-- Name: cosses cosses_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.cosses
    ADD CONSTRAINT cosses_pkey PRIMARY KEY (id);


--
-- TOC entry 5526 (class 2606 OID 54844)
-- Name: curative_maintenance_records curative_maintenance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.curative_maintenance_records
    ADD CONSTRAINT curative_maintenance_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4809 (class 2606 OID 24751)
-- Name: ecme_etat ecme_etat_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.ecme_etat
    ADD CONSTRAINT ecme_etat_pkey PRIMARY KEY (code);


--
-- TOC entry 4811 (class 2606 OID 24753)
-- Name: ecme_interventions ecme_interventions_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.ecme_interventions
    ADD CONSTRAINT ecme_interventions_pkey PRIMARY KEY (id);


--
-- TOC entry 4813 (class 2606 OID 56935)
-- Name: equipements equipements_code_rai_key; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key UNIQUE (code_rai);


--
-- TOC entry 4815 (class 2606 OID 56937)
-- Name: equipements equipements_code_rai_key1; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key1 UNIQUE (code_rai);


--
-- TOC entry 4817 (class 2606 OID 56939)
-- Name: equipements equipements_code_rai_key10; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key10 UNIQUE (code_rai);


--
-- TOC entry 4819 (class 2606 OID 56941)
-- Name: equipements equipements_code_rai_key100; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key100 UNIQUE (code_rai);


--
-- TOC entry 4821 (class 2606 OID 56943)
-- Name: equipements equipements_code_rai_key101; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key101 UNIQUE (code_rai);


--
-- TOC entry 4823 (class 2606 OID 56945)
-- Name: equipements equipements_code_rai_key102; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key102 UNIQUE (code_rai);


--
-- TOC entry 4825 (class 2606 OID 56947)
-- Name: equipements equipements_code_rai_key103; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key103 UNIQUE (code_rai);


--
-- TOC entry 4827 (class 2606 OID 56949)
-- Name: equipements equipements_code_rai_key104; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key104 UNIQUE (code_rai);


--
-- TOC entry 4829 (class 2606 OID 56951)
-- Name: equipements equipements_code_rai_key105; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key105 UNIQUE (code_rai);


--
-- TOC entry 4831 (class 2606 OID 56827)
-- Name: equipements equipements_code_rai_key106; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key106 UNIQUE (code_rai);


--
-- TOC entry 4833 (class 2606 OID 56829)
-- Name: equipements equipements_code_rai_key107; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key107 UNIQUE (code_rai);


--
-- TOC entry 4835 (class 2606 OID 56831)
-- Name: equipements equipements_code_rai_key108; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key108 UNIQUE (code_rai);


--
-- TOC entry 4837 (class 2606 OID 56833)
-- Name: equipements equipements_code_rai_key109; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key109 UNIQUE (code_rai);


--
-- TOC entry 4839 (class 2606 OID 56835)
-- Name: equipements equipements_code_rai_key11; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key11 UNIQUE (code_rai);


--
-- TOC entry 4841 (class 2606 OID 56837)
-- Name: equipements equipements_code_rai_key110; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key110 UNIQUE (code_rai);


--
-- TOC entry 4843 (class 2606 OID 56839)
-- Name: equipements equipements_code_rai_key111; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key111 UNIQUE (code_rai);


--
-- TOC entry 4845 (class 2606 OID 56841)
-- Name: equipements equipements_code_rai_key112; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key112 UNIQUE (code_rai);


--
-- TOC entry 4847 (class 2606 OID 56843)
-- Name: equipements equipements_code_rai_key113; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key113 UNIQUE (code_rai);


--
-- TOC entry 4849 (class 2606 OID 56845)
-- Name: equipements equipements_code_rai_key114; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key114 UNIQUE (code_rai);


--
-- TOC entry 4851 (class 2606 OID 56847)
-- Name: equipements equipements_code_rai_key115; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key115 UNIQUE (code_rai);


--
-- TOC entry 4853 (class 2606 OID 56849)
-- Name: equipements equipements_code_rai_key116; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key116 UNIQUE (code_rai);


--
-- TOC entry 4855 (class 2606 OID 56851)
-- Name: equipements equipements_code_rai_key117; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key117 UNIQUE (code_rai);


--
-- TOC entry 4857 (class 2606 OID 56853)
-- Name: equipements equipements_code_rai_key118; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key118 UNIQUE (code_rai);


--
-- TOC entry 4859 (class 2606 OID 56855)
-- Name: equipements equipements_code_rai_key119; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key119 UNIQUE (code_rai);


--
-- TOC entry 4861 (class 2606 OID 56857)
-- Name: equipements equipements_code_rai_key12; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key12 UNIQUE (code_rai);


--
-- TOC entry 4863 (class 2606 OID 56859)
-- Name: equipements equipements_code_rai_key120; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key120 UNIQUE (code_rai);


--
-- TOC entry 4865 (class 2606 OID 56861)
-- Name: equipements equipements_code_rai_key121; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key121 UNIQUE (code_rai);


--
-- TOC entry 4867 (class 2606 OID 56863)
-- Name: equipements equipements_code_rai_key122; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key122 UNIQUE (code_rai);


--
-- TOC entry 4869 (class 2606 OID 56865)
-- Name: equipements equipements_code_rai_key123; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key123 UNIQUE (code_rai);


--
-- TOC entry 4871 (class 2606 OID 56867)
-- Name: equipements equipements_code_rai_key124; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key124 UNIQUE (code_rai);


--
-- TOC entry 4873 (class 2606 OID 56871)
-- Name: equipements equipements_code_rai_key125; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key125 UNIQUE (code_rai);


--
-- TOC entry 4875 (class 2606 OID 56873)
-- Name: equipements equipements_code_rai_key126; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key126 UNIQUE (code_rai);


--
-- TOC entry 4877 (class 2606 OID 56875)
-- Name: equipements equipements_code_rai_key127; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key127 UNIQUE (code_rai);


--
-- TOC entry 4879 (class 2606 OID 56877)
-- Name: equipements equipements_code_rai_key128; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key128 UNIQUE (code_rai);


--
-- TOC entry 4881 (class 2606 OID 56879)
-- Name: equipements equipements_code_rai_key129; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key129 UNIQUE (code_rai);


--
-- TOC entry 4883 (class 2606 OID 56881)
-- Name: equipements equipements_code_rai_key13; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key13 UNIQUE (code_rai);


--
-- TOC entry 4885 (class 2606 OID 56883)
-- Name: equipements equipements_code_rai_key130; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key130 UNIQUE (code_rai);


--
-- TOC entry 4887 (class 2606 OID 56885)
-- Name: equipements equipements_code_rai_key131; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key131 UNIQUE (code_rai);


--
-- TOC entry 4889 (class 2606 OID 56887)
-- Name: equipements equipements_code_rai_key132; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key132 UNIQUE (code_rai);


--
-- TOC entry 4891 (class 2606 OID 57055)
-- Name: equipements equipements_code_rai_key133; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key133 UNIQUE (code_rai);


--
-- TOC entry 4893 (class 2606 OID 56933)
-- Name: equipements equipements_code_rai_key134; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key134 UNIQUE (code_rai);


--
-- TOC entry 4895 (class 2606 OID 57057)
-- Name: equipements equipements_code_rai_key135; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key135 UNIQUE (code_rai);


--
-- TOC entry 4897 (class 2606 OID 56931)
-- Name: equipements equipements_code_rai_key136; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key136 UNIQUE (code_rai);


--
-- TOC entry 4899 (class 2606 OID 57059)
-- Name: equipements equipements_code_rai_key137; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key137 UNIQUE (code_rai);


--
-- TOC entry 4901 (class 2606 OID 56929)
-- Name: equipements equipements_code_rai_key138; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key138 UNIQUE (code_rai);


--
-- TOC entry 4903 (class 2606 OID 57061)
-- Name: equipements equipements_code_rai_key139; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key139 UNIQUE (code_rai);


--
-- TOC entry 4905 (class 2606 OID 56889)
-- Name: equipements equipements_code_rai_key14; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key14 UNIQUE (code_rai);


--
-- TOC entry 4907 (class 2606 OID 56927)
-- Name: equipements equipements_code_rai_key140; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key140 UNIQUE (code_rai);


--
-- TOC entry 4909 (class 2606 OID 57063)
-- Name: equipements equipements_code_rai_key141; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key141 UNIQUE (code_rai);


--
-- TOC entry 4911 (class 2606 OID 56925)
-- Name: equipements equipements_code_rai_key142; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key142 UNIQUE (code_rai);


--
-- TOC entry 4913 (class 2606 OID 56815)
-- Name: equipements equipements_code_rai_key143; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key143 UNIQUE (code_rai);


--
-- TOC entry 4915 (class 2606 OID 56817)
-- Name: equipements equipements_code_rai_key144; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key144 UNIQUE (code_rai);


--
-- TOC entry 4917 (class 2606 OID 56819)
-- Name: equipements equipements_code_rai_key145; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key145 UNIQUE (code_rai);


--
-- TOC entry 4919 (class 2606 OID 56821)
-- Name: equipements equipements_code_rai_key146; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key146 UNIQUE (code_rai);


--
-- TOC entry 4921 (class 2606 OID 56823)
-- Name: equipements equipements_code_rai_key147; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key147 UNIQUE (code_rai);


--
-- TOC entry 4923 (class 2606 OID 57065)
-- Name: equipements equipements_code_rai_key148; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key148 UNIQUE (code_rai);


--
-- TOC entry 4925 (class 2606 OID 56813)
-- Name: equipements equipements_code_rai_key149; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key149 UNIQUE (code_rai);


--
-- TOC entry 4927 (class 2606 OID 56891)
-- Name: equipements equipements_code_rai_key15; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key15 UNIQUE (code_rai);


--
-- TOC entry 4929 (class 2606 OID 57067)
-- Name: equipements equipements_code_rai_key150; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key150 UNIQUE (code_rai);


--
-- TOC entry 4931 (class 2606 OID 56763)
-- Name: equipements equipements_code_rai_key151; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key151 UNIQUE (code_rai);


--
-- TOC entry 4933 (class 2606 OID 56825)
-- Name: equipements equipements_code_rai_key152; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key152 UNIQUE (code_rai);


--
-- TOC entry 4935 (class 2606 OID 56761)
-- Name: equipements equipements_code_rai_key153; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key153 UNIQUE (code_rai);


--
-- TOC entry 4937 (class 2606 OID 56869)
-- Name: equipements equipements_code_rai_key154; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key154 UNIQUE (code_rai);


--
-- TOC entry 4939 (class 2606 OID 56759)
-- Name: equipements equipements_code_rai_key155; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key155 UNIQUE (code_rai);


--
-- TOC entry 4941 (class 2606 OID 57013)
-- Name: equipements equipements_code_rai_key156; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key156 UNIQUE (code_rai);


--
-- TOC entry 4943 (class 2606 OID 56741)
-- Name: equipements equipements_code_rai_key157; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key157 UNIQUE (code_rai);


--
-- TOC entry 4945 (class 2606 OID 56993)
-- Name: equipements equipements_code_rai_key158; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key158 UNIQUE (code_rai);


--
-- TOC entry 4947 (class 2606 OID 56803)
-- Name: equipements equipements_code_rai_key159; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key159 UNIQUE (code_rai);


--
-- TOC entry 4949 (class 2606 OID 56893)
-- Name: equipements equipements_code_rai_key16; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key16 UNIQUE (code_rai);


--
-- TOC entry 4951 (class 2606 OID 57069)
-- Name: equipements equipements_code_rai_key160; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key160 UNIQUE (code_rai);


--
-- TOC entry 4953 (class 2606 OID 56801)
-- Name: equipements equipements_code_rai_key161; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key161 UNIQUE (code_rai);


--
-- TOC entry 4955 (class 2606 OID 57071)
-- Name: equipements equipements_code_rai_key162; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key162 UNIQUE (code_rai);


--
-- TOC entry 4957 (class 2606 OID 56799)
-- Name: equipements equipements_code_rai_key163; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key163 UNIQUE (code_rai);


--
-- TOC entry 4959 (class 2606 OID 57073)
-- Name: equipements equipements_code_rai_key164; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key164 UNIQUE (code_rai);


--
-- TOC entry 4961 (class 2606 OID 56797)
-- Name: equipements equipements_code_rai_key165; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key165 UNIQUE (code_rai);


--
-- TOC entry 4963 (class 2606 OID 57075)
-- Name: equipements equipements_code_rai_key166; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key166 UNIQUE (code_rai);


--
-- TOC entry 4965 (class 2606 OID 56795)
-- Name: equipements equipements_code_rai_key167; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key167 UNIQUE (code_rai);


--
-- TOC entry 4967 (class 2606 OID 57077)
-- Name: equipements equipements_code_rai_key168; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key168 UNIQUE (code_rai);


--
-- TOC entry 4969 (class 2606 OID 56895)
-- Name: equipements equipements_code_rai_key17; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key17 UNIQUE (code_rai);


--
-- TOC entry 4971 (class 2606 OID 56897)
-- Name: equipements equipements_code_rai_key18; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key18 UNIQUE (code_rai);


--
-- TOC entry 4973 (class 2606 OID 56899)
-- Name: equipements equipements_code_rai_key19; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key19 UNIQUE (code_rai);


--
-- TOC entry 4975 (class 2606 OID 56901)
-- Name: equipements equipements_code_rai_key2; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key2 UNIQUE (code_rai);


--
-- TOC entry 4977 (class 2606 OID 56903)
-- Name: equipements equipements_code_rai_key20; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key20 UNIQUE (code_rai);


--
-- TOC entry 4979 (class 2606 OID 56905)
-- Name: equipements equipements_code_rai_key21; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key21 UNIQUE (code_rai);


--
-- TOC entry 4981 (class 2606 OID 56907)
-- Name: equipements equipements_code_rai_key22; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key22 UNIQUE (code_rai);


--
-- TOC entry 4983 (class 2606 OID 56909)
-- Name: equipements equipements_code_rai_key23; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key23 UNIQUE (code_rai);


--
-- TOC entry 4985 (class 2606 OID 56911)
-- Name: equipements equipements_code_rai_key24; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key24 UNIQUE (code_rai);


--
-- TOC entry 4987 (class 2606 OID 56913)
-- Name: equipements equipements_code_rai_key25; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key25 UNIQUE (code_rai);


--
-- TOC entry 4989 (class 2606 OID 56915)
-- Name: equipements equipements_code_rai_key26; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key26 UNIQUE (code_rai);


--
-- TOC entry 4991 (class 2606 OID 56917)
-- Name: equipements equipements_code_rai_key27; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key27 UNIQUE (code_rai);


--
-- TOC entry 4993 (class 2606 OID 56919)
-- Name: equipements equipements_code_rai_key28; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key28 UNIQUE (code_rai);


--
-- TOC entry 4995 (class 2606 OID 56921)
-- Name: equipements equipements_code_rai_key29; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key29 UNIQUE (code_rai);


--
-- TOC entry 4997 (class 2606 OID 56923)
-- Name: equipements equipements_code_rai_key3; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key3 UNIQUE (code_rai);


--
-- TOC entry 4999 (class 2606 OID 56765)
-- Name: equipements equipements_code_rai_key30; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key30 UNIQUE (code_rai);


--
-- TOC entry 5001 (class 2606 OID 56767)
-- Name: equipements equipements_code_rai_key31; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key31 UNIQUE (code_rai);


--
-- TOC entry 5003 (class 2606 OID 56769)
-- Name: equipements equipements_code_rai_key32; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key32 UNIQUE (code_rai);


--
-- TOC entry 5005 (class 2606 OID 56771)
-- Name: equipements equipements_code_rai_key33; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key33 UNIQUE (code_rai);


--
-- TOC entry 5007 (class 2606 OID 56773)
-- Name: equipements equipements_code_rai_key34; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key34 UNIQUE (code_rai);


--
-- TOC entry 5009 (class 2606 OID 56775)
-- Name: equipements equipements_code_rai_key35; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key35 UNIQUE (code_rai);


--
-- TOC entry 5011 (class 2606 OID 56777)
-- Name: equipements equipements_code_rai_key36; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key36 UNIQUE (code_rai);


--
-- TOC entry 5013 (class 2606 OID 56779)
-- Name: equipements equipements_code_rai_key37; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key37 UNIQUE (code_rai);


--
-- TOC entry 5015 (class 2606 OID 56781)
-- Name: equipements equipements_code_rai_key38; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key38 UNIQUE (code_rai);


--
-- TOC entry 5017 (class 2606 OID 56783)
-- Name: equipements equipements_code_rai_key39; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key39 UNIQUE (code_rai);


--
-- TOC entry 5019 (class 2606 OID 56785)
-- Name: equipements equipements_code_rai_key4; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key4 UNIQUE (code_rai);


--
-- TOC entry 5021 (class 2606 OID 56787)
-- Name: equipements equipements_code_rai_key40; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key40 UNIQUE (code_rai);


--
-- TOC entry 5023 (class 2606 OID 56789)
-- Name: equipements equipements_code_rai_key41; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key41 UNIQUE (code_rai);


--
-- TOC entry 5025 (class 2606 OID 56791)
-- Name: equipements equipements_code_rai_key42; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key42 UNIQUE (code_rai);


--
-- TOC entry 5027 (class 2606 OID 56793)
-- Name: equipements equipements_code_rai_key43; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key43 UNIQUE (code_rai);


--
-- TOC entry 5029 (class 2606 OID 56805)
-- Name: equipements equipements_code_rai_key44; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key44 UNIQUE (code_rai);


--
-- TOC entry 5031 (class 2606 OID 56807)
-- Name: equipements equipements_code_rai_key45; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key45 UNIQUE (code_rai);


--
-- TOC entry 5033 (class 2606 OID 56809)
-- Name: equipements equipements_code_rai_key46; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key46 UNIQUE (code_rai);


--
-- TOC entry 5035 (class 2606 OID 56811)
-- Name: equipements equipements_code_rai_key47; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key47 UNIQUE (code_rai);


--
-- TOC entry 5037 (class 2606 OID 56953)
-- Name: equipements equipements_code_rai_key48; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key48 UNIQUE (code_rai);


--
-- TOC entry 5039 (class 2606 OID 56955)
-- Name: equipements equipements_code_rai_key49; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key49 UNIQUE (code_rai);


--
-- TOC entry 5041 (class 2606 OID 56957)
-- Name: equipements equipements_code_rai_key5; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key5 UNIQUE (code_rai);


--
-- TOC entry 5043 (class 2606 OID 56959)
-- Name: equipements equipements_code_rai_key50; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key50 UNIQUE (code_rai);


--
-- TOC entry 5045 (class 2606 OID 56961)
-- Name: equipements equipements_code_rai_key51; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key51 UNIQUE (code_rai);


--
-- TOC entry 5047 (class 2606 OID 56963)
-- Name: equipements equipements_code_rai_key52; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key52 UNIQUE (code_rai);


--
-- TOC entry 5049 (class 2606 OID 56965)
-- Name: equipements equipements_code_rai_key53; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key53 UNIQUE (code_rai);


--
-- TOC entry 5051 (class 2606 OID 56967)
-- Name: equipements equipements_code_rai_key54; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key54 UNIQUE (code_rai);


--
-- TOC entry 5053 (class 2606 OID 56969)
-- Name: equipements equipements_code_rai_key55; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key55 UNIQUE (code_rai);


--
-- TOC entry 5055 (class 2606 OID 56971)
-- Name: equipements equipements_code_rai_key56; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key56 UNIQUE (code_rai);


--
-- TOC entry 5057 (class 2606 OID 56973)
-- Name: equipements equipements_code_rai_key57; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key57 UNIQUE (code_rai);


--
-- TOC entry 5059 (class 2606 OID 56975)
-- Name: equipements equipements_code_rai_key58; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key58 UNIQUE (code_rai);


--
-- TOC entry 5061 (class 2606 OID 56977)
-- Name: equipements equipements_code_rai_key59; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key59 UNIQUE (code_rai);


--
-- TOC entry 5063 (class 2606 OID 56979)
-- Name: equipements equipements_code_rai_key6; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key6 UNIQUE (code_rai);


--
-- TOC entry 5065 (class 2606 OID 56981)
-- Name: equipements equipements_code_rai_key60; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key60 UNIQUE (code_rai);


--
-- TOC entry 5067 (class 2606 OID 56983)
-- Name: equipements equipements_code_rai_key61; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key61 UNIQUE (code_rai);


--
-- TOC entry 5069 (class 2606 OID 56985)
-- Name: equipements equipements_code_rai_key62; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key62 UNIQUE (code_rai);


--
-- TOC entry 5071 (class 2606 OID 56987)
-- Name: equipements equipements_code_rai_key63; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key63 UNIQUE (code_rai);


--
-- TOC entry 5073 (class 2606 OID 56989)
-- Name: equipements equipements_code_rai_key64; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key64 UNIQUE (code_rai);


--
-- TOC entry 5075 (class 2606 OID 56991)
-- Name: equipements equipements_code_rai_key65; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key65 UNIQUE (code_rai);


--
-- TOC entry 5077 (class 2606 OID 56995)
-- Name: equipements equipements_code_rai_key66; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key66 UNIQUE (code_rai);


--
-- TOC entry 5079 (class 2606 OID 56997)
-- Name: equipements equipements_code_rai_key67; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key67 UNIQUE (code_rai);


--
-- TOC entry 5081 (class 2606 OID 56999)
-- Name: equipements equipements_code_rai_key68; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key68 UNIQUE (code_rai);


--
-- TOC entry 5083 (class 2606 OID 57001)
-- Name: equipements equipements_code_rai_key69; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key69 UNIQUE (code_rai);


--
-- TOC entry 5085 (class 2606 OID 57003)
-- Name: equipements equipements_code_rai_key7; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key7 UNIQUE (code_rai);


--
-- TOC entry 5087 (class 2606 OID 57005)
-- Name: equipements equipements_code_rai_key70; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key70 UNIQUE (code_rai);


--
-- TOC entry 5089 (class 2606 OID 57007)
-- Name: equipements equipements_code_rai_key71; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key71 UNIQUE (code_rai);


--
-- TOC entry 5091 (class 2606 OID 57009)
-- Name: equipements equipements_code_rai_key72; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key72 UNIQUE (code_rai);


--
-- TOC entry 5093 (class 2606 OID 57011)
-- Name: equipements equipements_code_rai_key73; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key73 UNIQUE (code_rai);


--
-- TOC entry 5095 (class 2606 OID 57015)
-- Name: equipements equipements_code_rai_key74; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key74 UNIQUE (code_rai);


--
-- TOC entry 5097 (class 2606 OID 57017)
-- Name: equipements equipements_code_rai_key75; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key75 UNIQUE (code_rai);


--
-- TOC entry 5099 (class 2606 OID 57019)
-- Name: equipements equipements_code_rai_key76; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key76 UNIQUE (code_rai);


--
-- TOC entry 5101 (class 2606 OID 57021)
-- Name: equipements equipements_code_rai_key77; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key77 UNIQUE (code_rai);


--
-- TOC entry 5103 (class 2606 OID 57023)
-- Name: equipements equipements_code_rai_key78; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key78 UNIQUE (code_rai);


--
-- TOC entry 5105 (class 2606 OID 57025)
-- Name: equipements equipements_code_rai_key79; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key79 UNIQUE (code_rai);


--
-- TOC entry 5107 (class 2606 OID 57027)
-- Name: equipements equipements_code_rai_key8; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key8 UNIQUE (code_rai);


--
-- TOC entry 5109 (class 2606 OID 57029)
-- Name: equipements equipements_code_rai_key80; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key80 UNIQUE (code_rai);


--
-- TOC entry 5111 (class 2606 OID 57031)
-- Name: equipements equipements_code_rai_key81; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key81 UNIQUE (code_rai);


--
-- TOC entry 5113 (class 2606 OID 57033)
-- Name: equipements equipements_code_rai_key82; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key82 UNIQUE (code_rai);


--
-- TOC entry 5115 (class 2606 OID 56743)
-- Name: equipements equipements_code_rai_key83; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key83 UNIQUE (code_rai);


--
-- TOC entry 5117 (class 2606 OID 56745)
-- Name: equipements equipements_code_rai_key84; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key84 UNIQUE (code_rai);


--
-- TOC entry 5119 (class 2606 OID 56747)
-- Name: equipements equipements_code_rai_key85; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key85 UNIQUE (code_rai);


--
-- TOC entry 5121 (class 2606 OID 56749)
-- Name: equipements equipements_code_rai_key86; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key86 UNIQUE (code_rai);


--
-- TOC entry 5123 (class 2606 OID 56751)
-- Name: equipements equipements_code_rai_key87; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key87 UNIQUE (code_rai);


--
-- TOC entry 5125 (class 2606 OID 56753)
-- Name: equipements equipements_code_rai_key88; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key88 UNIQUE (code_rai);


--
-- TOC entry 5127 (class 2606 OID 56755)
-- Name: equipements equipements_code_rai_key89; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key89 UNIQUE (code_rai);


--
-- TOC entry 5129 (class 2606 OID 56757)
-- Name: equipements equipements_code_rai_key9; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key9 UNIQUE (code_rai);


--
-- TOC entry 5131 (class 2606 OID 57035)
-- Name: equipements equipements_code_rai_key90; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key90 UNIQUE (code_rai);


--
-- TOC entry 5133 (class 2606 OID 57037)
-- Name: equipements equipements_code_rai_key91; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key91 UNIQUE (code_rai);


--
-- TOC entry 5135 (class 2606 OID 57039)
-- Name: equipements equipements_code_rai_key92; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key92 UNIQUE (code_rai);


--
-- TOC entry 5137 (class 2606 OID 57041)
-- Name: equipements equipements_code_rai_key93; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key93 UNIQUE (code_rai);


--
-- TOC entry 5139 (class 2606 OID 57043)
-- Name: equipements equipements_code_rai_key94; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key94 UNIQUE (code_rai);


--
-- TOC entry 5141 (class 2606 OID 57045)
-- Name: equipements equipements_code_rai_key95; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key95 UNIQUE (code_rai);


--
-- TOC entry 5143 (class 2606 OID 57047)
-- Name: equipements equipements_code_rai_key96; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key96 UNIQUE (code_rai);


--
-- TOC entry 5145 (class 2606 OID 57049)
-- Name: equipements equipements_code_rai_key97; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key97 UNIQUE (code_rai);


--
-- TOC entry 5147 (class 2606 OID 57051)
-- Name: equipements equipements_code_rai_key98; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key98 UNIQUE (code_rai);


--
-- TOC entry 5149 (class 2606 OID 57053)
-- Name: equipements equipements_code_rai_key99; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_code_rai_key99 UNIQUE (code_rai);


--
-- TOC entry 5151 (class 2606 OID 25021)
-- Name: equipements equipements_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_pkey PRIMARY KEY (id);


--
-- TOC entry 5153 (class 2606 OID 25023)
-- Name: fabricants fabricants_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.fabricants
    ADD CONSTRAINT fabricants_pkey PRIMARY KEY (id);


--
-- TOC entry 5156 (class 2606 OID 25025)
-- Name: maintenance_events maintenance_events_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.maintenance_events
    ADD CONSTRAINT maintenance_events_pkey PRIMARY KEY (id);


--
-- TOC entry 5518 (class 2606 OID 41583)
-- Name: maintenance_sheets maintenance_sheets_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.maintenance_sheets
    ADD CONSTRAINT maintenance_sheets_pkey PRIMARY KEY (id);


--
-- TOC entry 5158 (class 2606 OID 25027)
-- Name: pince_maintenance_records pince_maintenance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pince_maintenance_records
    ADD CONSTRAINT pince_maintenance_records_pkey PRIMARY KEY (id);


--
-- TOC entry 5520 (class 2606 OID 41640)
-- Name: pince_preventive_records pince_preventive_records_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pince_preventive_records
    ADD CONSTRAINT pince_preventive_records_pkey PRIMARY KEY (id);


--
-- TOC entry 5160 (class 2606 OID 25029)
-- Name: pince_variants pince_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pince_variants
    ADD CONSTRAINT pince_variants_pkey PRIMARY KEY (id);


--
-- TOC entry 5162 (class 2606 OID 57132)
-- Name: pinces pinces_numero_pince_key; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pinces
    ADD CONSTRAINT pinces_numero_pince_key UNIQUE (numero_pince);


--
-- TOC entry 5164 (class 2606 OID 25033)
-- Name: pinces pinces_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pinces
    ADD CONSTRAINT pinces_pkey PRIMARY KEY (id);


--
-- TOC entry 5166 (class 2606 OID 56441)
-- Name: zones zones_nom_zone_key; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key UNIQUE (nom_zone);


--
-- TOC entry 5168 (class 2606 OID 56443)
-- Name: zones zones_nom_zone_key1; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key1 UNIQUE (nom_zone);


--
-- TOC entry 5170 (class 2606 OID 56445)
-- Name: zones zones_nom_zone_key10; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key10 UNIQUE (nom_zone);


--
-- TOC entry 5172 (class 2606 OID 56447)
-- Name: zones zones_nom_zone_key100; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key100 UNIQUE (nom_zone);


--
-- TOC entry 5174 (class 2606 OID 56449)
-- Name: zones zones_nom_zone_key101; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key101 UNIQUE (nom_zone);


--
-- TOC entry 5176 (class 2606 OID 56451)
-- Name: zones zones_nom_zone_key102; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key102 UNIQUE (nom_zone);


--
-- TOC entry 5178 (class 2606 OID 56453)
-- Name: zones zones_nom_zone_key103; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key103 UNIQUE (nom_zone);


--
-- TOC entry 5180 (class 2606 OID 56455)
-- Name: zones zones_nom_zone_key104; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key104 UNIQUE (nom_zone);


--
-- TOC entry 5182 (class 2606 OID 56457)
-- Name: zones zones_nom_zone_key105; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key105 UNIQUE (nom_zone);


--
-- TOC entry 5184 (class 2606 OID 56459)
-- Name: zones zones_nom_zone_key106; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key106 UNIQUE (nom_zone);


--
-- TOC entry 5186 (class 2606 OID 56461)
-- Name: zones zones_nom_zone_key107; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key107 UNIQUE (nom_zone);


--
-- TOC entry 5188 (class 2606 OID 56463)
-- Name: zones zones_nom_zone_key108; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key108 UNIQUE (nom_zone);


--
-- TOC entry 5190 (class 2606 OID 56465)
-- Name: zones zones_nom_zone_key109; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key109 UNIQUE (nom_zone);


--
-- TOC entry 5192 (class 2606 OID 56467)
-- Name: zones zones_nom_zone_key11; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key11 UNIQUE (nom_zone);


--
-- TOC entry 5194 (class 2606 OID 56469)
-- Name: zones zones_nom_zone_key110; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key110 UNIQUE (nom_zone);


--
-- TOC entry 5196 (class 2606 OID 56471)
-- Name: zones zones_nom_zone_key111; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key111 UNIQUE (nom_zone);


--
-- TOC entry 5198 (class 2606 OID 56473)
-- Name: zones zones_nom_zone_key112; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key112 UNIQUE (nom_zone);


--
-- TOC entry 5200 (class 2606 OID 56475)
-- Name: zones zones_nom_zone_key113; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key113 UNIQUE (nom_zone);


--
-- TOC entry 5202 (class 2606 OID 56477)
-- Name: zones zones_nom_zone_key114; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key114 UNIQUE (nom_zone);


--
-- TOC entry 5204 (class 2606 OID 56479)
-- Name: zones zones_nom_zone_key115; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key115 UNIQUE (nom_zone);


--
-- TOC entry 5206 (class 2606 OID 56481)
-- Name: zones zones_nom_zone_key116; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key116 UNIQUE (nom_zone);


--
-- TOC entry 5208 (class 2606 OID 56483)
-- Name: zones zones_nom_zone_key117; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key117 UNIQUE (nom_zone);


--
-- TOC entry 5210 (class 2606 OID 56485)
-- Name: zones zones_nom_zone_key118; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key118 UNIQUE (nom_zone);


--
-- TOC entry 5212 (class 2606 OID 56487)
-- Name: zones zones_nom_zone_key119; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key119 UNIQUE (nom_zone);


--
-- TOC entry 5214 (class 2606 OID 56489)
-- Name: zones zones_nom_zone_key12; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key12 UNIQUE (nom_zone);


--
-- TOC entry 5216 (class 2606 OID 56491)
-- Name: zones zones_nom_zone_key120; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key120 UNIQUE (nom_zone);


--
-- TOC entry 5218 (class 2606 OID 56493)
-- Name: zones zones_nom_zone_key121; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key121 UNIQUE (nom_zone);


--
-- TOC entry 5220 (class 2606 OID 56495)
-- Name: zones zones_nom_zone_key122; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key122 UNIQUE (nom_zone);


--
-- TOC entry 5222 (class 2606 OID 56497)
-- Name: zones zones_nom_zone_key123; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key123 UNIQUE (nom_zone);


--
-- TOC entry 5224 (class 2606 OID 56499)
-- Name: zones zones_nom_zone_key124; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key124 UNIQUE (nom_zone);


--
-- TOC entry 5226 (class 2606 OID 56501)
-- Name: zones zones_nom_zone_key125; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key125 UNIQUE (nom_zone);


--
-- TOC entry 5228 (class 2606 OID 56503)
-- Name: zones zones_nom_zone_key126; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key126 UNIQUE (nom_zone);


--
-- TOC entry 5230 (class 2606 OID 56505)
-- Name: zones zones_nom_zone_key127; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key127 UNIQUE (nom_zone);


--
-- TOC entry 5232 (class 2606 OID 56507)
-- Name: zones zones_nom_zone_key128; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key128 UNIQUE (nom_zone);


--
-- TOC entry 5234 (class 2606 OID 56509)
-- Name: zones zones_nom_zone_key129; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key129 UNIQUE (nom_zone);


--
-- TOC entry 5236 (class 2606 OID 56511)
-- Name: zones zones_nom_zone_key13; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key13 UNIQUE (nom_zone);


--
-- TOC entry 5238 (class 2606 OID 56513)
-- Name: zones zones_nom_zone_key130; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key130 UNIQUE (nom_zone);


--
-- TOC entry 5240 (class 2606 OID 56515)
-- Name: zones zones_nom_zone_key131; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key131 UNIQUE (nom_zone);


--
-- TOC entry 5242 (class 2606 OID 56517)
-- Name: zones zones_nom_zone_key132; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key132 UNIQUE (nom_zone);


--
-- TOC entry 5244 (class 2606 OID 56519)
-- Name: zones zones_nom_zone_key133; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key133 UNIQUE (nom_zone);


--
-- TOC entry 5246 (class 2606 OID 56521)
-- Name: zones zones_nom_zone_key134; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key134 UNIQUE (nom_zone);


--
-- TOC entry 5248 (class 2606 OID 56523)
-- Name: zones zones_nom_zone_key135; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key135 UNIQUE (nom_zone);


--
-- TOC entry 5250 (class 2606 OID 56525)
-- Name: zones zones_nom_zone_key136; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key136 UNIQUE (nom_zone);


--
-- TOC entry 5252 (class 2606 OID 56527)
-- Name: zones zones_nom_zone_key137; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key137 UNIQUE (nom_zone);


--
-- TOC entry 5254 (class 2606 OID 56529)
-- Name: zones zones_nom_zone_key138; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key138 UNIQUE (nom_zone);


--
-- TOC entry 5256 (class 2606 OID 56729)
-- Name: zones zones_nom_zone_key139; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key139 UNIQUE (nom_zone);


--
-- TOC entry 5258 (class 2606 OID 56531)
-- Name: zones zones_nom_zone_key14; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key14 UNIQUE (nom_zone);


--
-- TOC entry 5260 (class 2606 OID 56439)
-- Name: zones zones_nom_zone_key140; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key140 UNIQUE (nom_zone);


--
-- TOC entry 5262 (class 2606 OID 56437)
-- Name: zones zones_nom_zone_key141; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key141 UNIQUE (nom_zone);


--
-- TOC entry 5264 (class 2606 OID 56435)
-- Name: zones zones_nom_zone_key142; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key142 UNIQUE (nom_zone);


--
-- TOC entry 5266 (class 2606 OID 56731)
-- Name: zones zones_nom_zone_key143; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key143 UNIQUE (nom_zone);


--
-- TOC entry 5268 (class 2606 OID 56433)
-- Name: zones zones_nom_zone_key144; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key144 UNIQUE (nom_zone);


--
-- TOC entry 5270 (class 2606 OID 56431)
-- Name: zones zones_nom_zone_key145; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key145 UNIQUE (nom_zone);


--
-- TOC entry 5272 (class 2606 OID 56427)
-- Name: zones zones_nom_zone_key146; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key146 UNIQUE (nom_zone);


--
-- TOC entry 5274 (class 2606 OID 56733)
-- Name: zones zones_nom_zone_key147; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key147 UNIQUE (nom_zone);


--
-- TOC entry 5276 (class 2606 OID 56425)
-- Name: zones zones_nom_zone_key148; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key148 UNIQUE (nom_zone);


--
-- TOC entry 5278 (class 2606 OID 56639)
-- Name: zones zones_nom_zone_key149; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key149 UNIQUE (nom_zone);


--
-- TOC entry 5280 (class 2606 OID 56533)
-- Name: zones zones_nom_zone_key15; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key15 UNIQUE (nom_zone);


--
-- TOC entry 5282 (class 2606 OID 56641)
-- Name: zones zones_nom_zone_key150; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key150 UNIQUE (nom_zone);


--
-- TOC entry 5284 (class 2606 OID 56643)
-- Name: zones zones_nom_zone_key151; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key151 UNIQUE (nom_zone);


--
-- TOC entry 5286 (class 2606 OID 56645)
-- Name: zones zones_nom_zone_key152; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key152 UNIQUE (nom_zone);


--
-- TOC entry 5288 (class 2606 OID 56647)
-- Name: zones zones_nom_zone_key153; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key153 UNIQUE (nom_zone);


--
-- TOC entry 5290 (class 2606 OID 56735)
-- Name: zones zones_nom_zone_key154; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key154 UNIQUE (nom_zone);


--
-- TOC entry 5292 (class 2606 OID 56423)
-- Name: zones zones_nom_zone_key155; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key155 UNIQUE (nom_zone);


--
-- TOC entry 5294 (class 2606 OID 56421)
-- Name: zones zones_nom_zone_key156; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key156 UNIQUE (nom_zone);


--
-- TOC entry 5296 (class 2606 OID 56429)
-- Name: zones zones_nom_zone_key157; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key157 UNIQUE (nom_zone);


--
-- TOC entry 5298 (class 2606 OID 56419)
-- Name: zones zones_nom_zone_key158; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key158 UNIQUE (nom_zone);


--
-- TOC entry 5300 (class 2606 OID 56417)
-- Name: zones zones_nom_zone_key159; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key159 UNIQUE (nom_zone);


--
-- TOC entry 5302 (class 2606 OID 56535)
-- Name: zones zones_nom_zone_key16; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key16 UNIQUE (nom_zone);


--
-- TOC entry 5304 (class 2606 OID 56415)
-- Name: zones zones_nom_zone_key160; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key160 UNIQUE (nom_zone);


--
-- TOC entry 5306 (class 2606 OID 56413)
-- Name: zones zones_nom_zone_key161; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key161 UNIQUE (nom_zone);


--
-- TOC entry 5308 (class 2606 OID 56411)
-- Name: zones zones_nom_zone_key162; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key162 UNIQUE (nom_zone);


--
-- TOC entry 5310 (class 2606 OID 56409)
-- Name: zones zones_nom_zone_key163; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key163 UNIQUE (nom_zone);


--
-- TOC entry 5312 (class 2606 OID 56407)
-- Name: zones zones_nom_zone_key164; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key164 UNIQUE (nom_zone);


--
-- TOC entry 5314 (class 2606 OID 56405)
-- Name: zones zones_nom_zone_key165; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key165 UNIQUE (nom_zone);


--
-- TOC entry 5316 (class 2606 OID 56737)
-- Name: zones zones_nom_zone_key166; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key166 UNIQUE (nom_zone);


--
-- TOC entry 5318 (class 2606 OID 56403)
-- Name: zones zones_nom_zone_key167; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key167 UNIQUE (nom_zone);


--
-- TOC entry 5320 (class 2606 OID 56401)
-- Name: zones zones_nom_zone_key168; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key168 UNIQUE (nom_zone);


--
-- TOC entry 5322 (class 2606 OID 56399)
-- Name: zones zones_nom_zone_key169; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key169 UNIQUE (nom_zone);


--
-- TOC entry 5324 (class 2606 OID 56537)
-- Name: zones zones_nom_zone_key17; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key17 UNIQUE (nom_zone);


--
-- TOC entry 5326 (class 2606 OID 56397)
-- Name: zones zones_nom_zone_key170; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key170 UNIQUE (nom_zone);


--
-- TOC entry 5328 (class 2606 OID 56395)
-- Name: zones zones_nom_zone_key171; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key171 UNIQUE (nom_zone);


--
-- TOC entry 5330 (class 2606 OID 56393)
-- Name: zones zones_nom_zone_key172; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key172 UNIQUE (nom_zone);


--
-- TOC entry 5332 (class 2606 OID 56391)
-- Name: zones zones_nom_zone_key173; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key173 UNIQUE (nom_zone);


--
-- TOC entry 5334 (class 2606 OID 56389)
-- Name: zones zones_nom_zone_key174; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key174 UNIQUE (nom_zone);


--
-- TOC entry 5336 (class 2606 OID 56539)
-- Name: zones zones_nom_zone_key18; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key18 UNIQUE (nom_zone);


--
-- TOC entry 5338 (class 2606 OID 56541)
-- Name: zones zones_nom_zone_key19; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key19 UNIQUE (nom_zone);


--
-- TOC entry 5340 (class 2606 OID 56543)
-- Name: zones zones_nom_zone_key2; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key2 UNIQUE (nom_zone);


--
-- TOC entry 5342 (class 2606 OID 56545)
-- Name: zones zones_nom_zone_key20; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key20 UNIQUE (nom_zone);


--
-- TOC entry 5344 (class 2606 OID 56547)
-- Name: zones zones_nom_zone_key21; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key21 UNIQUE (nom_zone);


--
-- TOC entry 5346 (class 2606 OID 56549)
-- Name: zones zones_nom_zone_key22; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key22 UNIQUE (nom_zone);


--
-- TOC entry 5348 (class 2606 OID 56551)
-- Name: zones zones_nom_zone_key23; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key23 UNIQUE (nom_zone);


--
-- TOC entry 5350 (class 2606 OID 56553)
-- Name: zones zones_nom_zone_key24; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key24 UNIQUE (nom_zone);


--
-- TOC entry 5352 (class 2606 OID 56555)
-- Name: zones zones_nom_zone_key25; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key25 UNIQUE (nom_zone);


--
-- TOC entry 5354 (class 2606 OID 56557)
-- Name: zones zones_nom_zone_key26; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key26 UNIQUE (nom_zone);


--
-- TOC entry 5356 (class 2606 OID 56559)
-- Name: zones zones_nom_zone_key27; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key27 UNIQUE (nom_zone);


--
-- TOC entry 5358 (class 2606 OID 56561)
-- Name: zones zones_nom_zone_key28; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key28 UNIQUE (nom_zone);


--
-- TOC entry 5360 (class 2606 OID 56563)
-- Name: zones zones_nom_zone_key29; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key29 UNIQUE (nom_zone);


--
-- TOC entry 5362 (class 2606 OID 56565)
-- Name: zones zones_nom_zone_key3; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key3 UNIQUE (nom_zone);


--
-- TOC entry 5364 (class 2606 OID 56567)
-- Name: zones zones_nom_zone_key30; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key30 UNIQUE (nom_zone);


--
-- TOC entry 5366 (class 2606 OID 56569)
-- Name: zones zones_nom_zone_key31; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key31 UNIQUE (nom_zone);


--
-- TOC entry 5368 (class 2606 OID 56571)
-- Name: zones zones_nom_zone_key32; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key32 UNIQUE (nom_zone);


--
-- TOC entry 5370 (class 2606 OID 56573)
-- Name: zones zones_nom_zone_key33; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key33 UNIQUE (nom_zone);


--
-- TOC entry 5372 (class 2606 OID 56575)
-- Name: zones zones_nom_zone_key34; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key34 UNIQUE (nom_zone);


--
-- TOC entry 5374 (class 2606 OID 56577)
-- Name: zones zones_nom_zone_key35; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key35 UNIQUE (nom_zone);


--
-- TOC entry 5376 (class 2606 OID 56579)
-- Name: zones zones_nom_zone_key36; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key36 UNIQUE (nom_zone);


--
-- TOC entry 5378 (class 2606 OID 56581)
-- Name: zones zones_nom_zone_key37; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key37 UNIQUE (nom_zone);


--
-- TOC entry 5380 (class 2606 OID 56583)
-- Name: zones zones_nom_zone_key38; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key38 UNIQUE (nom_zone);


--
-- TOC entry 5382 (class 2606 OID 56585)
-- Name: zones zones_nom_zone_key39; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key39 UNIQUE (nom_zone);


--
-- TOC entry 5384 (class 2606 OID 56587)
-- Name: zones zones_nom_zone_key4; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key4 UNIQUE (nom_zone);


--
-- TOC entry 5386 (class 2606 OID 56589)
-- Name: zones zones_nom_zone_key40; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key40 UNIQUE (nom_zone);


--
-- TOC entry 5388 (class 2606 OID 56591)
-- Name: zones zones_nom_zone_key41; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key41 UNIQUE (nom_zone);


--
-- TOC entry 5390 (class 2606 OID 56593)
-- Name: zones zones_nom_zone_key42; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key42 UNIQUE (nom_zone);


--
-- TOC entry 5392 (class 2606 OID 56595)
-- Name: zones zones_nom_zone_key43; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key43 UNIQUE (nom_zone);


--
-- TOC entry 5394 (class 2606 OID 56597)
-- Name: zones zones_nom_zone_key44; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key44 UNIQUE (nom_zone);


--
-- TOC entry 5396 (class 2606 OID 56599)
-- Name: zones zones_nom_zone_key45; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key45 UNIQUE (nom_zone);


--
-- TOC entry 5398 (class 2606 OID 56601)
-- Name: zones zones_nom_zone_key46; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key46 UNIQUE (nom_zone);


--
-- TOC entry 5400 (class 2606 OID 56603)
-- Name: zones zones_nom_zone_key47; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key47 UNIQUE (nom_zone);


--
-- TOC entry 5402 (class 2606 OID 56605)
-- Name: zones zones_nom_zone_key48; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key48 UNIQUE (nom_zone);


--
-- TOC entry 5404 (class 2606 OID 56607)
-- Name: zones zones_nom_zone_key49; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key49 UNIQUE (nom_zone);


--
-- TOC entry 5406 (class 2606 OID 56609)
-- Name: zones zones_nom_zone_key5; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key5 UNIQUE (nom_zone);


--
-- TOC entry 5408 (class 2606 OID 56611)
-- Name: zones zones_nom_zone_key50; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key50 UNIQUE (nom_zone);


--
-- TOC entry 5410 (class 2606 OID 56613)
-- Name: zones zones_nom_zone_key51; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key51 UNIQUE (nom_zone);


--
-- TOC entry 5412 (class 2606 OID 56615)
-- Name: zones zones_nom_zone_key52; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key52 UNIQUE (nom_zone);


--
-- TOC entry 5414 (class 2606 OID 56617)
-- Name: zones zones_nom_zone_key53; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key53 UNIQUE (nom_zone);


--
-- TOC entry 5416 (class 2606 OID 56619)
-- Name: zones zones_nom_zone_key54; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key54 UNIQUE (nom_zone);


--
-- TOC entry 5418 (class 2606 OID 56621)
-- Name: zones zones_nom_zone_key55; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key55 UNIQUE (nom_zone);


--
-- TOC entry 5420 (class 2606 OID 56623)
-- Name: zones zones_nom_zone_key56; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key56 UNIQUE (nom_zone);


--
-- TOC entry 5422 (class 2606 OID 56625)
-- Name: zones zones_nom_zone_key57; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key57 UNIQUE (nom_zone);


--
-- TOC entry 5424 (class 2606 OID 56627)
-- Name: zones zones_nom_zone_key58; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key58 UNIQUE (nom_zone);


--
-- TOC entry 5426 (class 2606 OID 56629)
-- Name: zones zones_nom_zone_key59; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key59 UNIQUE (nom_zone);


--
-- TOC entry 5428 (class 2606 OID 56631)
-- Name: zones zones_nom_zone_key6; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key6 UNIQUE (nom_zone);


--
-- TOC entry 5430 (class 2606 OID 56633)
-- Name: zones zones_nom_zone_key60; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key60 UNIQUE (nom_zone);


--
-- TOC entry 5432 (class 2606 OID 56635)
-- Name: zones zones_nom_zone_key61; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key61 UNIQUE (nom_zone);


--
-- TOC entry 5434 (class 2606 OID 56637)
-- Name: zones zones_nom_zone_key62; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key62 UNIQUE (nom_zone);


--
-- TOC entry 5436 (class 2606 OID 56649)
-- Name: zones zones_nom_zone_key63; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key63 UNIQUE (nom_zone);


--
-- TOC entry 5438 (class 2606 OID 56651)
-- Name: zones zones_nom_zone_key64; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key64 UNIQUE (nom_zone);


--
-- TOC entry 5440 (class 2606 OID 56653)
-- Name: zones zones_nom_zone_key65; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key65 UNIQUE (nom_zone);


--
-- TOC entry 5442 (class 2606 OID 56655)
-- Name: zones zones_nom_zone_key66; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key66 UNIQUE (nom_zone);


--
-- TOC entry 5444 (class 2606 OID 56657)
-- Name: zones zones_nom_zone_key67; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key67 UNIQUE (nom_zone);


--
-- TOC entry 5446 (class 2606 OID 56659)
-- Name: zones zones_nom_zone_key68; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key68 UNIQUE (nom_zone);


--
-- TOC entry 5448 (class 2606 OID 56661)
-- Name: zones zones_nom_zone_key69; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key69 UNIQUE (nom_zone);


--
-- TOC entry 5450 (class 2606 OID 56663)
-- Name: zones zones_nom_zone_key7; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key7 UNIQUE (nom_zone);


--
-- TOC entry 5452 (class 2606 OID 56665)
-- Name: zones zones_nom_zone_key70; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key70 UNIQUE (nom_zone);


--
-- TOC entry 5454 (class 2606 OID 56667)
-- Name: zones zones_nom_zone_key71; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key71 UNIQUE (nom_zone);


--
-- TOC entry 5456 (class 2606 OID 56669)
-- Name: zones zones_nom_zone_key72; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key72 UNIQUE (nom_zone);


--
-- TOC entry 5458 (class 2606 OID 56671)
-- Name: zones zones_nom_zone_key73; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key73 UNIQUE (nom_zone);


--
-- TOC entry 5460 (class 2606 OID 56673)
-- Name: zones zones_nom_zone_key74; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key74 UNIQUE (nom_zone);


--
-- TOC entry 5462 (class 2606 OID 56675)
-- Name: zones zones_nom_zone_key75; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key75 UNIQUE (nom_zone);


--
-- TOC entry 5464 (class 2606 OID 56677)
-- Name: zones zones_nom_zone_key76; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key76 UNIQUE (nom_zone);


--
-- TOC entry 5466 (class 2606 OID 56679)
-- Name: zones zones_nom_zone_key77; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key77 UNIQUE (nom_zone);


--
-- TOC entry 5468 (class 2606 OID 56681)
-- Name: zones zones_nom_zone_key78; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key78 UNIQUE (nom_zone);


--
-- TOC entry 5470 (class 2606 OID 56683)
-- Name: zones zones_nom_zone_key79; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key79 UNIQUE (nom_zone);


--
-- TOC entry 5472 (class 2606 OID 56685)
-- Name: zones zones_nom_zone_key8; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key8 UNIQUE (nom_zone);


--
-- TOC entry 5474 (class 2606 OID 56687)
-- Name: zones zones_nom_zone_key80; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key80 UNIQUE (nom_zone);


--
-- TOC entry 5476 (class 2606 OID 56689)
-- Name: zones zones_nom_zone_key81; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key81 UNIQUE (nom_zone);


--
-- TOC entry 5478 (class 2606 OID 56691)
-- Name: zones zones_nom_zone_key82; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key82 UNIQUE (nom_zone);


--
-- TOC entry 5480 (class 2606 OID 56693)
-- Name: zones zones_nom_zone_key83; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key83 UNIQUE (nom_zone);


--
-- TOC entry 5482 (class 2606 OID 56695)
-- Name: zones zones_nom_zone_key84; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key84 UNIQUE (nom_zone);


--
-- TOC entry 5484 (class 2606 OID 56697)
-- Name: zones zones_nom_zone_key85; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key85 UNIQUE (nom_zone);


--
-- TOC entry 5486 (class 2606 OID 56699)
-- Name: zones zones_nom_zone_key86; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key86 UNIQUE (nom_zone);


--
-- TOC entry 5488 (class 2606 OID 56701)
-- Name: zones zones_nom_zone_key87; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key87 UNIQUE (nom_zone);


--
-- TOC entry 5490 (class 2606 OID 56703)
-- Name: zones zones_nom_zone_key88; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key88 UNIQUE (nom_zone);


--
-- TOC entry 5492 (class 2606 OID 56705)
-- Name: zones zones_nom_zone_key89; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key89 UNIQUE (nom_zone);


--
-- TOC entry 5494 (class 2606 OID 56707)
-- Name: zones zones_nom_zone_key9; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key9 UNIQUE (nom_zone);


--
-- TOC entry 5496 (class 2606 OID 56709)
-- Name: zones zones_nom_zone_key90; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key90 UNIQUE (nom_zone);


--
-- TOC entry 5498 (class 2606 OID 56711)
-- Name: zones zones_nom_zone_key91; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key91 UNIQUE (nom_zone);


--
-- TOC entry 5500 (class 2606 OID 56713)
-- Name: zones zones_nom_zone_key92; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key92 UNIQUE (nom_zone);


--
-- TOC entry 5502 (class 2606 OID 56715)
-- Name: zones zones_nom_zone_key93; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key93 UNIQUE (nom_zone);


--
-- TOC entry 5504 (class 2606 OID 56717)
-- Name: zones zones_nom_zone_key94; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key94 UNIQUE (nom_zone);


--
-- TOC entry 5506 (class 2606 OID 56719)
-- Name: zones zones_nom_zone_key95; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key95 UNIQUE (nom_zone);


--
-- TOC entry 5508 (class 2606 OID 56721)
-- Name: zones zones_nom_zone_key96; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key96 UNIQUE (nom_zone);


--
-- TOC entry 5510 (class 2606 OID 56723)
-- Name: zones zones_nom_zone_key97; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key97 UNIQUE (nom_zone);


--
-- TOC entry 5512 (class 2606 OID 56725)
-- Name: zones zones_nom_zone_key98; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key98 UNIQUE (nom_zone);


--
-- TOC entry 5514 (class 2606 OID 56727)
-- Name: zones zones_nom_zone_key99; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_nom_zone_key99 UNIQUE (nom_zone);


--
-- TOC entry 5516 (class 2606 OID 25313)
-- Name: zones zones_pkey; Type: CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_pkey PRIMARY KEY (id);


--
-- TOC entry 5154 (class 1259 OID 57095)
-- Name: maintenance_events_equip_code_interval_type_week_year; Type: INDEX; Schema: public; Owner: webrai_user
--

CREATE UNIQUE INDEX maintenance_events_equip_code_interval_type_week_year ON public.maintenance_events USING btree (equip_code, interval_type, week, year);


--
-- TOC entry 5527 (class 2606 OID 25315)
-- Name: applicateur_maintenance_records applicateur_maintenance_records_applicateur_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateur_maintenance_records
    ADD CONSTRAINT applicateur_maintenance_records_applicateur_variant_id_fkey FOREIGN KEY (applicateur_variant_id) REFERENCES public.applicateur_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5528 (class 2606 OID 25320)
-- Name: applicateur_variants applicateur_variants_applicateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateur_variants
    ADD CONSTRAINT applicateur_variants_applicateur_id_fkey FOREIGN KEY (applicateur_id) REFERENCES public.applicateurs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5529 (class 2606 OID 57154)
-- Name: applicateurs applicateurs_fabricant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.applicateurs
    ADD CONSTRAINT applicateurs_fabricant_id_fkey FOREIGN KEY (fabricant_id) REFERENCES public.fabricants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5536 (class 2606 OID 54845)
-- Name: curative_maintenance_records curative_maintenance_records_equipement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.curative_maintenance_records
    ADD CONSTRAINT curative_maintenance_records_equipement_id_fkey FOREIGN KEY (equipement_id) REFERENCES public.equipements(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5530 (class 2606 OID 57118)
-- Name: ecme_interventions ecme_interventions_ecme_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.ecme_interventions
    ADD CONSTRAINT ecme_interventions_ecme_code_fkey FOREIGN KEY (ecme_code) REFERENCES public.ecme_etat(code) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5531 (class 2606 OID 57085)
-- Name: equipements equipements_fabricant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_fabricant_id_fkey FOREIGN KEY (fabricant_id) REFERENCES public.fabricants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5532 (class 2606 OID 57080)
-- Name: equipements equipements_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5533 (class 2606 OID 57147)
-- Name: pince_maintenance_records pince_maintenance_records_pince_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pince_maintenance_records
    ADD CONSTRAINT pince_maintenance_records_pince_variant_id_fkey FOREIGN KEY (pince_variant_id) REFERENCES public.pince_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5534 (class 2606 OID 57140)
-- Name: pince_variants pince_variants_pince_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pince_variants
    ADD CONSTRAINT pince_variants_pince_id_fkey FOREIGN KEY (pince_id) REFERENCES public.pinces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5535 (class 2606 OID 57135)
-- Name: pinces pinces_fabricant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: webrai_user
--

ALTER TABLE ONLY public.pinces
    ADD CONSTRAINT pinces_fabricant_id_fkey FOREIGN KEY (fabricant_id) REFERENCES public.fabricants(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2026-04-28 10:50:32

--
-- PostgreSQL database dump complete
--

\unrestrict 1OQgblrDgf43ljr6p99pbIqPYRzQEWALNdQJNlPL3dYQoTmazJZuYUhkdG8pGEP

