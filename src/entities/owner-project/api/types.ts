import type { PublicProjectDocument } from '@/entities/project';
import type { PublicProject } from '@/entities/project/model/public-project';

export type OwnerProject = PublicProject;

export type OwnerProjectDetailsResponse = {
  data: {
    project: OwnerProject;
    metrics: {
      applicationsCount: number;
      confirmedAmount: number;
    };
  };
};

export type OwnerProjectInvestments = {
  data: {
    applicationsCount: number;
    pendingAmount: number;
    confirmedAmount: number;
  };
};

export type ProjectReport = {
  id: string;
  title: string;
  summary: string | null;
  fileUrl: string | null;
  reportDate: string;
  isPublic: boolean;
};

export type OwnerProjectDocument = PublicProjectDocument;
