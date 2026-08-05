import { describe, it, expect } from 'vitest';
import { EXPERIENCE_DATA } from '@/lib/experience';

describe('experience lib', () => {
  it('should contain exactly 5 experience entries', () => {
    expect(EXPERIENCE_DATA).toHaveLength(5);
  });

  it('should have all entries with required fields', () => {
    for (const entry of EXPERIENCE_DATA) {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('company');
      expect(entry).toHaveProperty('role');
      expect(entry).toHaveProperty('client');
      expect(entry).toHaveProperty('location');
      expect(entry).toHaveProperty('startDate');
      expect(entry).toHaveProperty('status');
      expect(entry).toHaveProperty('mission');
      expect(entry).toHaveProperty('impact');
      expect(entry).toHaveProperty('stack');
      expect(Array.isArray(entry.impact)).toBe(true);
      expect(Array.isArray(entry.stack)).toBe(true);
    }
  });

  /* ── CV fact checks ─────────────────────────────────────────── */

  it('TALAN R&D: should mention 7 filtres avancés and Excel/CSV 1M+ lignes', () => {
    const entry = EXPERIENCE_DATA.find((e) => e.id === 'talan-rd');
    expect(entry).toBeDefined();
    expect(entry?.stack).toContain('Angular');
    const impacts = entry!.impact.join(' ');
    expect(impacts).toContain('7 filtres');
    expect(impacts).toContain('1M+ lignes');
  });

  it('Hardis React/Python: mission is suivi managérial, no JUnit mention, contains Firebase Auth and Pytest', () => {
    const entry = EXPERIENCE_DATA.find((e) => e.id === 'hardis-react');
    expect(entry).toBeDefined();
    expect(entry!.mission).toContain('suivi managérial');
    expect(entry!.stack).toContain('Firebase');
    const impacts = entry!.impact.join(' ');
    expect(impacts).toContain('Firebase Auth');
    expect(impacts).toContain('Pytest');
    expect(impacts).toContain('7 pages');
    expect(impacts).toContain('20 utilisateurs');
    expect(impacts).not.toContain('JUnit');
  });

  it('Hardis Java: mission is isolation/chauffage, 64 tests JUnit +7% cover, filtrage -50%, Android only (no iOS)', () => {
    const entry = EXPERIENCE_DATA.find((e) => e.id === 'hardis-java');
    expect(entry).toBeDefined();
    expect(entry!.mission).toContain('isolation');
    expect(entry!.mission).toContain('chauffage');
    const impacts = entry!.impact.join(' ');
    expect(impacts).toContain('64 tests JUnit');
    expect(impacts).toContain('+7%');
    expect(impacts).toContain('50%');
    expect(entry!.stack).toContain('Android');
    expect(entry!.stack).not.toContain('iOS');
  });

  it('Digit-R Xamarin: mission is chauffeurs VTC, 6 écrans, notifications push, géolocalisation temps réel, includes SQL Server', () => {
    const entry = EXPERIENCE_DATA.find((e) => e.id === 'digit-xamarin');
    expect(entry).toBeDefined();
    expect(entry!.mission).toContain('VTC');
    const impacts = entry!.impact.join(' ');
    expect(impacts).toContain('6 écrans');
    expect(impacts).toContain('Notifications push');
    expect(impacts).toContain('Géolocalisation');
    expect(entry!.stack).toContain('SQL Server');
  });

  it('TALAN SNCF: remains unchanged with 10+ écrans, validateurs, export Excel', () => {
    const entry = EXPERIENCE_DATA.find((e) => e.id === 'talan-sncf');
    expect(entry).toBeDefined();
    expect(entry!.status).toBe('active');
    expect(entry!.endDate).toBeNull();
    const impacts = entry!.impact.join(' ');
    expect(impacts).toContain('10+ écrans');
    expect(impacts).toContain('Scripts SQL');
  });
});
