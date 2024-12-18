interface EligibilityItem {
  address: string;
  amount: number;
}

interface EligibilityCategory {
  category: string;
  items: EligibilityItem[];
  total: number;
}

interface EligibilityResponse {
  total: number;
  totalUnclaimed: number;
  categories: EligibilityCategory[];
  addresses: string[];
}

interface ClaimItem {
  data: string;
  signatures: string[];
}

interface ClaimResponse {
  claim: ClaimItem[];
}

export type {
  ClaimItem,
  ClaimResponse,
  EligibilityItem,
  EligibilityCategory,
  EligibilityResponse,
};
