import { TestBed } from '@angular/core/testing';
import { PatientFilesRepository } from './patient-files.repository';

describe('PatientFilesRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create and remove patient files', () => {
    const repository = TestBed.inject(PatientFilesRepository);
    const beforeCount = repository.findByPatientId('p-001').length;

    repository.create({
      patientId: 'p-001',
      type: 'report',
      fileName: 'reporte-evolucion-marzo.pdf'
    });

    const afterCreate = repository.findByPatientId('p-001');
    expect(afterCreate.length).toBe(beforeCount + 1);
    expect(afterCreate[0]?.fileName).toContain('reporte-evolucion-marzo');

    repository.remove(afterCreate[0].id);
    const afterRemove = repository.findByPatientId('p-001');
    expect(afterRemove.length).toBe(beforeCount);
  });
});
