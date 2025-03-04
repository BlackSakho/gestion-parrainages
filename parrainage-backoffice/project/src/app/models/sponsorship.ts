export interface Sponsorship {
    id: string;
    candidateId: string;
    voterElectorNumber: string;
    voterFirstName: string;
    voterLastName: string;
    region: string;
    department: string;
    date: string;
    status: 'pending' | 'validated' | 'rejected';
  }
  
  export interface SponsorshipStats {
    candidateId: string;
    candidateName: string;
    totalSponsors: number;
    validatedSponsors: number;
    pendingSponsors: number;
    rejectedSponsors: number;
    byRegion: {
      [region: string]: number;
    };
    byDepartment: {
      [department: string]: number;
    };
    dailyProgress: {
      date: string;
      count: number;
    }[];
  }