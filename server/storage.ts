import { 
  users, type User, type InsertUser,
  indicators, type Indicator, type InsertIndicator,
  associates, type Associate, type InsertAssociate,
  missions, type Mission, type InsertMission,
  indicatorStatusEnum
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Indicator methods
  getIndicators(): Promise<Indicator[]>;
  getIndicator(id: number): Promise<Indicator | undefined>;
  getIndicatorByCode(code: string): Promise<Indicator | undefined>;
  createIndicator(indicator: InsertIndicator): Promise<Indicator>;
  updateIndicator(id: number, indicator: Partial<InsertIndicator>): Promise<Indicator | undefined>;

  // Associate methods
  getAssociates(): Promise<Associate[]>;
  getAssociate(id: number): Promise<Associate | undefined>;
  createAssociate(associate: InsertAssociate): Promise<Associate>;
  updateAssociate(id: number, associate: Partial<InsertAssociate>): Promise<Associate | undefined>;
  deleteAssociate(id: number): Promise<boolean>;

  // Mission methods
  getMissions(): Promise<Mission[]>;
  getMissionsByAssociate(associateId: number): Promise<Mission[]>;
  getMissionsByIndicator(indicatorId: number): Promise<Mission[]>;
  getMission(id: number): Promise<Mission | undefined>;
  createMission(mission: InsertMission): Promise<Mission>;
  updateMission(id: number, mission: Partial<InsertMission>): Promise<Mission | undefined>;
  deleteMission(id: number): Promise<boolean>;

  // Stats methods
  getStats(): Promise<{
    totalCoreIndicators: number;
    validatedCoreIndicators: number;
    totalOptionalIndicators: number;
    validatedOptionalIndicators: number;
    fixedCompensation: number;
    maxFixedCompensation: number;
    variableCompensation: number;
    maxVariableCompensation: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private indicatorsMap: Map<number, Indicator>;
  private associatesMap: Map<number, Associate>;
  private missionsMap: Map<number, Mission>;
  
  private currentUserId: number;
  private currentIndicatorId: number;
  private currentAssociateId: number;
  private currentMissionId: number;

  constructor() {
    this.users = new Map();
    this.indicatorsMap = new Map();
    this.associatesMap = new Map();
    this.missionsMap = new Map();
    
    this.currentUserId = 1;
    this.currentIndicatorId = 1;
    this.currentAssociateId = 1;
    this.currentMissionId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create core indicators
    const coreIndicators: InsertIndicator[] = [
      {
        code: "S01",
        name: "Système d'information",
        description: "Mise en place d'un système d'information partagé",
        type: "core",
        objective: "100%",
        maxCompensation: 7200
      },
      {
        code: "S02",
        name: "Agenda partagé",
        description: "Mise en place d'un agenda partagé",
        type: "core",
        objective: "100%",
        maxCompensation: 4800
      },
      {
        code: "S03",
        name: "Protocoles pluriprofessionnels",
        description: "Élaboration de protocoles pluriprofessionnels",
        type: "core",
        objective: "Min. 8",
        maxCompensation: 6400
      },
      {
        code: "S04",
        name: "Concertation pluriprofessionnelle",
        description: "Organisation de réunions de concertation pluriprofessionnelles",
        type: "core",
        objective: "Min. 12 réunions",
        maxCompensation: 5600
      },
      {
        code: "S05",
        name: "Formation ETP patients",
        description: "Formation d'éducation thérapeutique pour les patients",
        type: "core",
        objective: "40 patients",
        maxCompensation: 5200
      }
    ];

    // Create optional indicators
    const optionalIndicators: InsertIndicator[] = [
      {
        code: "O01",
        name: "Coordination externe",
        description: "Coordination avec les acteurs externes",
        type: "optional",
        objective: "Min. 4 partenariats",
        maxCompensation: 3500
      },
      {
        code: "O02",
        name: "Prévention santé",
        description: "Actions de prévention en santé publique",
        type: "optional",
        objective: "Min. 6 actions",
        maxCompensation: 4200
      },
      {
        code: "O03",
        name: "Coordination interne",
        description: "Coordination interne des soins",
        type: "optional",
        objective: "90% des patients",
        maxCompensation: 3800
      },
      {
        code: "O04",
        name: "Qualité des soins",
        description: "Mesures pour améliorer la qualité des soins",
        type: "optional",
        objective: "3 indicateurs",
        maxCompensation: 4000
      }
    ];

    // Add core indicators
    coreIndicators.forEach(indicator => {
      this.createIndicator(indicator);
    });

    // Add optional indicators
    optionalIndicators.forEach(indicator => {
      this.createIndicator(indicator);
    });

    // Create associates
    const associates: InsertAssociate[] = [
      {
        firstName: "Martin",
        lastName: "Dubois",
        profession: "doctor",
        email: "martin.dubois@example.com",
        phone: "0123456789"
      },
      {
        firstName: "Sophie",
        lastName: "Lefevre",
        profession: "doctor",
        email: "sophie.lefevre@example.com",
        phone: "0234567890"
      },
      {
        firstName: "Philippe",
        lastName: "Moreau",
        profession: "pharmacist",
        email: "philippe.moreau@example.com",
        phone: "0345678901"
      }
    ];

    // Add associates
    const createdAssociates = associates.map(associate => this.createAssociate(associate));

    // Create missions
    // For Martin Dubois (validated missions)
    this.createMission({
      associateId: 1,
      indicatorId: 1, // S01
      status: "validated",
      currentValue: "Completed",
      compensation: 7200,
      notes: "Système mis en place et pleinement fonctionnel"
    });

    this.createMission({
      associateId: 1,
      indicatorId: 5, // S05
      status: "validated",
      currentValue: "42 patients",
      compensation: 5200,
      notes: "Formation ETP réalisée avec succès"
    });

    this.createMission({
      associateId: 1,
      indicatorId: 6, // O01
      status: "in_progress",
      currentValue: "2 partenariats",
      compensation: 0,
      notes: "En cours avec l'hôpital local et le CCAS"
    });

    // For Sophie Lefevre
    this.createMission({
      associateId: 2,
      indicatorId: 2, // S02
      status: "validated",
      currentValue: "Completed",
      compensation: 4800,
      notes: "Agenda partagé mis en place"
    });

    this.createMission({
      associateId: 2,
      indicatorId: 8, // O03
      status: "validated",
      currentValue: "92%",
      compensation: 3800,
      notes: "Système de coordination interne efficace"
    });

    this.createMission({
      associateId: 2,
      indicatorId: 4, // S04
      status: "not_validated",
      currentValue: "4 réunions",
      compensation: 0,
      notes: "Nombre insuffisant de réunions"
    });

    // For Philippe Moreau
    this.createMission({
      associateId: 3,
      indicatorId: 3, // S03
      status: "validated",
      currentValue: "9 protocoles",
      compensation: 6400,
      notes: "Protocoles bien documentés et mis en œuvre"
    });

    this.createMission({
      associateId: 3,
      indicatorId: 7, // O02
      status: "in_progress",
      currentValue: "3 actions",
      compensation: 0,
      notes: "Actions préventives en cours de réalisation"
    });

    this.createMission({
      associateId: 3,
      indicatorId: 9, // O04
      status: "not_validated",
      currentValue: "1 indicateur",
      compensation: 0,
      notes: "Indicateurs de qualité insuffisants"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Indicator methods
  async getIndicators(): Promise<Indicator[]> {
    return Array.from(this.indicatorsMap.values());
  }

  async getIndicator(id: number): Promise<Indicator | undefined> {
    return this.indicatorsMap.get(id);
  }

  async getIndicatorByCode(code: string): Promise<Indicator | undefined> {
    return Array.from(this.indicatorsMap.values()).find(
      (indicator) => indicator.code === code
    );
  }

  async createIndicator(insertIndicator: InsertIndicator): Promise<Indicator> {
    const id = this.currentIndicatorId++;
    const indicator: Indicator = { ...insertIndicator, id };
    this.indicatorsMap.set(id, indicator);
    return indicator;
  }

  async updateIndicator(id: number, indicator: Partial<InsertIndicator>): Promise<Indicator | undefined> {
    const existing = this.indicatorsMap.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...indicator };
    this.indicatorsMap.set(id, updated);
    return updated;
  }

  // Associate methods
  async getAssociates(): Promise<Associate[]> {
    return Array.from(this.associatesMap.values());
  }

  async getAssociate(id: number): Promise<Associate | undefined> {
    return this.associatesMap.get(id);
  }

  async createAssociate(insertAssociate: InsertAssociate): Promise<Associate> {
    const id = this.currentAssociateId++;
    const associate: Associate = { ...insertAssociate, id };
    this.associatesMap.set(id, associate);
    return associate;
  }

  async updateAssociate(id: number, associate: Partial<InsertAssociate>): Promise<Associate | undefined> {
    const existing = this.associatesMap.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...associate };
    this.associatesMap.set(id, updated);
    return updated;
  }

  async deleteAssociate(id: number): Promise<boolean> {
    return this.associatesMap.delete(id);
  }

  // Mission methods
  async getMissions(): Promise<Mission[]> {
    return Array.from(this.missionsMap.values());
  }

  async getMissionsByAssociate(associateId: number): Promise<Mission[]> {
    return Array.from(this.missionsMap.values()).filter(
      (mission) => mission.associateId === associateId
    );
  }

  async getMissionsByIndicator(indicatorId: number): Promise<Mission[]> {
    return Array.from(this.missionsMap.values()).filter(
      (mission) => mission.indicatorId === indicatorId
    );
  }

  async getMission(id: number): Promise<Mission | undefined> {
    return this.missionsMap.get(id);
  }

  async createMission(insertMission: InsertMission): Promise<Mission> {
    const id = this.currentMissionId++;
    const mission: Mission = { ...insertMission, id };
    this.missionsMap.set(id, mission);
    return mission;
  }

  async updateMission(id: number, mission: Partial<InsertMission>): Promise<Mission | undefined> {
    const existing = this.missionsMap.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...mission };
    this.missionsMap.set(id, updated);
    return updated;
  }

  async deleteMission(id: number): Promise<boolean> {
    return this.missionsMap.delete(id);
  }

  // Stats methods
  async getStats(): Promise<{
    totalCoreIndicators: number;
    validatedCoreIndicators: number;
    totalOptionalIndicators: number;
    validatedOptionalIndicators: number;
    fixedCompensation: number;
    maxFixedCompensation: number;
    variableCompensation: number;
    maxVariableCompensation: number;
  }> {
    const indicators = await this.getIndicators();
    const missions = await this.getMissions();
    
    const coreIndicators = indicators.filter(i => i.type === 'core');
    const optionalIndicators = indicators.filter(i => i.type === 'optional');
    
    const coreIndicatorIds = new Set(coreIndicators.map(i => i.id));
    const optionalIndicatorIds = new Set(optionalIndicators.map(i => i.id));
    
    const coreMissions = missions.filter(m => coreIndicatorIds.has(m.indicatorId));
    const optionalMissions = missions.filter(m => optionalIndicatorIds.has(m.indicatorId));
    
    const validatedCoreMissions = coreMissions.filter(m => m.status === 'validated');
    const validatedOptionalMissions = optionalMissions.filter(m => m.status === 'validated');
    
    const fixedCompensation = validatedCoreMissions.reduce((sum, m) => sum + m.compensation, 0);
    const variableCompensation = validatedOptionalMissions.reduce((sum, m) => sum + m.compensation, 0);
    
    const maxFixedCompensation = coreIndicators.reduce((sum, i) => sum + i.maxCompensation, 0);
    const maxVariableCompensation = optionalIndicators.reduce((sum, i) => sum + i.maxCompensation, 0);
    
    return {
      totalCoreIndicators: coreIndicators.length,
      validatedCoreIndicators: validatedCoreMissions.length,
      totalOptionalIndicators: optionalIndicators.length,
      validatedOptionalIndicators: validatedOptionalMissions.length,
      fixedCompensation,
      maxFixedCompensation,
      variableCompensation,
      maxVariableCompensation
    };
  }
}

export const storage = new MemStorage();
