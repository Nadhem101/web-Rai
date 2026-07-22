-- Seed equipements.maintenance_intervals with the preventive schedule that used to
-- live only in frontend/src/utils/maintenanceSchedule.js (hardcoded EQUIPEMENTS array).
-- Moves the real schedule data into the DB column already built to hold it, so the
-- frontend no longer needs a static fallback list.
-- Safe to re-run: only touches rows that don't already have an explicit schedule.
-- Run in Supabase SQL editor.

UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":2,"color":"blue"}]'::json WHERE code_rai = 'EQUIP347' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"6M","freq":26,"start":3,"color":"green"}]'::json WHERE code_rai = 'EQUIP210' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":3,"color":"blue"}]'::json WHERE code_rai = 'EQUIP395' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":4,"color":"blue"}]'::json WHERE code_rai = 'EQUIP432' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"6M","freq":26,"start":2,"color":"green"}]'::json WHERE code_rai = 'EQUIP355' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":1,"color":"blue"}]'::json WHERE code_rai = 'EQUIP349' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":2,"color":"blue"}]'::json WHERE code_rai = 'EQUIP451' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":1,"color":"blue"},{"type":"6M","freq":26,"start":1,"color":"green"}]'::json WHERE code_rai = 'EQUIP476' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":2,"color":"blue"}]'::json WHERE code_rai = 'EQUIP75' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":3,"color":"blue"}]'::json WHERE code_rai = 'EQUIP353' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"6M","freq":26,"start":4,"color":"green"}]'::json WHERE code_rai = 'EQUIP457' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":1,"color":"blue"},{"type":"6M","freq":26,"start":1,"color":"green"}]'::json WHERE code_rai = 'EQUIP444' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":4,"color":"blue"}]'::json WHERE code_rai = 'EQUIP86' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":1,"color":"blue"}]'::json WHERE code_rai = 'EQUIP405' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":2,"color":"blue"}]'::json WHERE code_rai = 'EQUIP342' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":3,"color":"blue"}]'::json WHERE code_rai = 'EQUIP343' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"6M","freq":26,"start":2,"color":"green"}]'::json WHERE code_rai = 'EQUIP450' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":4,"color":"blue"}]'::json WHERE code_rai = 'EQUIP194' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":1,"color":"blue"},{"type":"6M","freq":26,"start":1,"color":"green"}]'::json WHERE code_rai = 'EQUIP85' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"6M","freq":26,"start":5,"color":"green"}]'::json WHERE code_rai = 'EQUIP391' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":2,"color":"blue"}]'::json WHERE code_rai = 'EQUIP458' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":3,"color":"blue"}]'::json WHERE code_rai = 'EQUIP340' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":4,"color":"blue"}]'::json WHERE code_rai = 'EQUIP63' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":1,"color":"blue"}]'::json WHERE code_rai = 'EQUIP459' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"6M","freq":26,"start":3,"color":"green"}]'::json WHERE code_rai = 'EQUIP460' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":2,"color":"blue"}]'::json WHERE code_rai = 'EQUIP461' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"6M","freq":26,"start":1,"color":"green"}]'::json WHERE code_rai = 'EQUIP462' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":4,"color":"blue"},{"type":"6M","freq":26,"start":4,"color":"green"}]'::json WHERE code_rai = 'EQUIP341' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":1,"color":"blue"}]'::json WHERE code_rai = 'EQUIP384' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"6M","freq":26,"start":2,"color":"green"}]'::json WHERE code_rai = 'EQUIP473' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":3,"color":"blue"},{"type":"6M","freq":26,"start":3,"color":"green"}]'::json WHERE code_rai = 'EQUIP46' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":2,"color":"blue"}]'::json WHERE code_rai = 'EQUIP466' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"6M","freq":26,"start":4,"color":"green"}]'::json WHERE code_rai = 'EQUIP95' AND maintenance_intervals IS NULL;
UPDATE equipements SET maintenance_intervals = '[{"type":"1M","freq":4,"start":1,"color":"blue"},{"type":"6M","freq":26,"start":27,"color":"green"}]'::json WHERE code_rai = 'EQUIP65' AND maintenance_intervals IS NULL;
