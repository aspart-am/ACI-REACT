// server/index.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  indicatorsMap;
  associatesMap;
  missionsMap;
  currentUserId;
  currentIndicatorId;
  currentAssociateId;
  currentMissionId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.indicatorsMap = /* @__PURE__ */ new Map();
    this.associatesMap = /* @__PURE__ */ new Map();
    this.missionsMap = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentIndicatorId = 1;
    this.currentAssociateId = 1;
    this.currentMissionId = 1;
    this.initializeData();
  }
  initializeData() {
    const axe1SocleIndicators = [
      {
        code: "AS01",
        name: "Horaires d'ouverture et soins non programm\xE9s",
        description: "Amplitude horaire d'ouverture et acc\xE8s \xE0 des soins non programm\xE9s chaque jour ouvr\xE9",
        type: "core",
        objective: "100%",
        maxCompensation: 4e3
        // 800 points × 5€
      },
      {
        code: "AS02",
        name: "R\xE9ponse aux crises sanitaires graves",
        description: "R\xE9daction d'un plan de pr\xE9paration \xE0 la r\xE9ponse de crise sanitaire et mise en \u0153uvre d'actions",
        type: "core",
        objective: "R\xE9daction du plan (pr\xE9requis) + actions en cas de crise",
        maxCompensation: 2250
        // (100 points + 350 points) × 5€
      }
    ];
    const axe1OptIndicators = [
      {
        code: "AO01",
        name: "Diversit\xE9 des services de soins",
        description: "Offre d'une diversit\xE9 de services de soins m\xE9dicaux sp\xE9cialis\xE9s ou de pharmaciens et/ou de soins param\xE9dicaux",
        type: "optional",
        objective: "Diversit\xE9 des cat\xE9gories de professionnels",
        maxCompensation: 2250
        // 450 points × 5€
      },
      {
        code: "AO02",
        name: "Consultations de sp\xE9cialistes",
        description: "Consultations de sp\xE9cialistes de second recours ou sages-femmes ou chirurgiens-dentistes ou pharmaciens vacataires",
        type: "optional",
        objective: "Organisation effective",
        maxCompensation: 1e3
        // 200 points × 5€
      },
      {
        code: "AO03",
        name: "Accueil de m\xE9decins en CSTM",
        description: "Accueil de m\xE9decins intervenant dans la structure dans le cadre d'un Contrat de Solidarit\xE9 Territoriale M\xE9decin",
        type: "optional",
        objective: "Pr\xE9sence effective d'un m\xE9decin en CSTM",
        maxCompensation: 1e3
        // 200 points × 5€
      },
      {
        code: "AO04",
        name: "Missions de sant\xE9 publique",
        description: "Participation \xE0 des missions de sant\xE9 publique (vaccination, d\xE9pistage, pr\xE9vention, etc.)",
        type: "optional",
        objective: "Min. 4 missions",
        maxCompensation: 1750
        // 350 points × 5€
      },
      {
        code: "AO05",
        name: "Implication des usagers",
        description: "Mise en place d'une d\xE9marche d'implication des usagers",
        type: "optional",
        objective: "D\xE9marche effective",
        maxCompensation: 1e3
        // 200 points × 5€
      },
      {
        code: "AO06",
        name: "SAS - Service d'Acc\xE8s aux Soins",
        description: "Soins non programm\xE9s en lien avec le dispositif de Service d'Acc\xE8s aux Soins",
        type: "optional",
        objective: "Participation effective au SAS",
        maxCompensation: 1250
        // 250 points × 5€
      }
    ];
    const axe2SoclePrerequisIndicators = [
      {
        code: "CS01",
        name: "Fonction de coordination",
        description: "Mise en place d'une fonction de coordination bien identifi\xE9e et temps d\xE9di\xE9",
        type: "core",
        objective: "Temps d\xE9di\xE9 \xE0 la coordination et outils disponibles",
        maxCompensation: 7e3
        // 1400 points × 5€
      }
    ];
    const axe2SocleIndicators = [
      {
        code: "CS02",
        name: "Protocoles pluriprofessionnels",
        description: "\xC9laboration et mise en \u0153uvre de protocoles pluriprofessionnels pour la prise en charge de patients \xE0 risque de fragilit\xE9",
        type: "core",
        objective: "Min. 8 protocoles",
        maxCompensation: 5e3
        // 1000 points × 5€
      },
      {
        code: "CS03",
        name: "Concertation pluriprofessionnelle",
        description: "Organisation de r\xE9unions de concertation pluriprofessionnelles sur les dossiers patients",
        type: "core",
        objective: "Min. 12 r\xE9unions/an",
        maxCompensation: 5e3
        // 1000 points × 5€
      }
    ];
    const axe2OptIndicators = [
      {
        code: "CO01",
        name: "Formation professionnels de sant\xE9",
        description: "Accueil et formation de professionnels de sant\xE9 (stagiaires m\xE9dicaux et param\xE9dicaux)",
        type: "optional",
        objective: "Accueil effectif de stagiaires",
        maxCompensation: 2500
        // 500 points × 5€
      },
      {
        code: "CO02",
        name: "Coordination externe",
        description: "Coordination avec acteurs m\xE9dico-sociaux et sociaux (EHPAD, SSIAD, etc.)",
        type: "optional",
        objective: "Min. 4 partenariats formalis\xE9s",
        maxCompensation: 2e3
        // 400 points × 5€
      },
      {
        code: "CO03",
        name: "D\xE9marche qualit\xE9",
        description: "Mise en place d'une d\xE9marche d'\xE9valuation et d'am\xE9lioration des pratiques",
        type: "optional",
        objective: "D\xE9marche effective et formalis\xE9e",
        maxCompensation: 2e3
        // 400 points × 5€
      },
      {
        code: "CO04",
        name: "Protocoles soins non programm\xE9s",
        description: "Mise en place de protocoles nationaux de coop\xE9ration pour les soins non programm\xE9s",
        type: "optional",
        objective: "Application effective des protocoles",
        maxCompensation: 1750
        // 350 points × 5€
      },
      {
        code: "CO05",
        name: "Parcours insuffisance cardiaque",
        description: "Coordination d'un parcours insuffisance cardiaque avec t\xE9l\xE9surveillance",
        type: "optional",
        objective: "Min. 5 patients suivis",
        maxCompensation: 2250
        // 450 points × 5€
      },
      {
        code: "CO06",
        name: "Parcours ob\xE9sit\xE9 enfant",
        description: "Coordination d'un parcours 'surpoids ou ob\xE9sit\xE9 de l'enfant'",
        type: "optional",
        objective: "Parcours formalis\xE9 et effectif",
        maxCompensation: 2e3
        // 400 points × 5€
      }
    ];
    const axe3SocleIndicators = [
      {
        code: "SI01",
        name: "Syst\xE8me d'information niveau standard",
        description: "Syst\xE8me d'information conforme au r\xE9f\xE9rentiel \xE9tabli par l'ANS (niveau standard)",
        type: "core",
        objective: "Utilisation par tous les professionnels",
        maxCompensation: 4e3
        // 800 points × 5€
      }
    ];
    const axe3OptIndicators = [
      {
        code: "SIO1",
        name: "Syst\xE8me d'information niveau avanc\xE9",
        description: "Syst\xE8me d'information conforme au r\xE9f\xE9rentiel \xE9tabli par l'ANS (niveau avanc\xE9)",
        type: "optional",
        objective: "D\xE9ploiement et utilisation effective",
        maxCompensation: 2e3
        // 400 points × 5€
      }
    ];
    const allCoreIndicators = [
      ...axe1SocleIndicators,
      ...axe2SoclePrerequisIndicators,
      ...axe2SocleIndicators,
      ...axe3SocleIndicators
    ];
    const allOptionalIndicators = [
      ...axe1OptIndicators,
      ...axe2OptIndicators,
      ...axe3OptIndicators
    ];
    for (const indicator of allCoreIndicators) {
      this.createIndicator(indicator);
    }
    for (const indicator of allOptionalIndicators) {
      this.createIndicator(indicator);
    }
    const associates2 = [
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
    const createdAssociates = associates2.map((associate) => this.createAssociate(associate));
    this.createMission({
      associateId: 1,
      indicatorId: 1,
      // AS01 - Horaires d'ouverture et soins non programmés
      status: "validated",
      currentValue: "41h/semaine",
      compensation: 4e3,
      notes: "Amplitude horaire respect\xE9e et soins non programm\xE9s disponibles"
    });
    this.createMission({
      associateId: 1,
      indicatorId: 6,
      // CS01 - Fonction de coordination
      status: "validated",
      currentValue: "10h par semaine",
      compensation: 7e3,
      notes: "Temps d\xE9di\xE9 \xE0 la coordination bien d\xE9fini et occup\xE9 par l'associ\xE9"
    });
    this.createMission({
      associateId: 1,
      indicatorId: 10,
      // CO01 - Formation de professionnels de santé
      status: "in_progress",
      currentValue: "1 stagiaire",
      compensation: 0,
      notes: "Un stagiaire en m\xE9decine g\xE9n\xE9rale accueilli, en attente d'un second"
    });
    this.createMission({
      associateId: 2,
      indicatorId: 2,
      // AS02 - Réponse aux crises sanitaires graves
      status: "validated",
      currentValue: "Plan r\xE9dig\xE9 et mis en \u0153uvre",
      compensation: 2250,
      notes: "Plan de crise r\xE9dig\xE9 et une intervention lors d'un pic \xE9pid\xE9mique"
    });
    this.createMission({
      associateId: 2,
      indicatorId: 7,
      // CS02 - Protocoles pluriprofessionnels
      status: "validated",
      currentValue: "9 protocoles",
      compensation: 5e3,
      notes: "Protocoles bien document\xE9s et mis en \u0153uvre"
    });
    this.createMission({
      associateId: 2,
      indicatorId: 11,
      // CO02 - Coordination externe
      status: "not_validated",
      currentValue: "2 partenariats",
      compensation: 0,
      notes: "Partenariats avec EHPAD et SSIAD, mais nombre insuffisant"
    });
    this.createMission({
      associateId: 3,
      indicatorId: 8,
      // CS03 - Concertation pluriprofessionnelle
      status: "validated",
      currentValue: "15 r\xE9unions",
      compensation: 5e3,
      notes: "R\xE9unions r\xE9guli\xE8res document\xE9es avec compte-rendus"
    });
    this.createMission({
      associateId: 3,
      indicatorId: 3,
      // AO01 - Diversité des services de soins
      status: "in_progress",
      currentValue: "4 cat\xE9gories",
      compensation: 0,
      notes: "M\xE9decins, pharmaciens, infirmiers et kin\xE9s disponibles"
    });
    this.createMission({
      associateId: 3,
      indicatorId: 9,
      // SI01 - Système d'information niveau standard
      status: "validated",
      currentValue: "D\xE9ploy\xE9 et utilis\xE9 par tous",
      compensation: 4e3,
      notes: "Logiciel conforme au r\xE9f\xE9rentiel ANS et utilis\xE9 par 100% des professionnels"
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Indicator methods
  async getIndicators() {
    return Array.from(this.indicatorsMap.values());
  }
  async getIndicator(id) {
    return this.indicatorsMap.get(id);
  }
  async getIndicatorByCode(code) {
    return Array.from(this.indicatorsMap.values()).find(
      (indicator) => indicator.code === code
    );
  }
  async createIndicator(insertIndicator) {
    const id = this.currentIndicatorId++;
    const indicator = { ...insertIndicator, id };
    this.indicatorsMap.set(id, indicator);
    return indicator;
  }
  async updateIndicator(id, indicator) {
    const existing = this.indicatorsMap.get(id);
    if (!existing) {
      return void 0;
    }
    const updated = { ...existing, ...indicator };
    this.indicatorsMap.set(id, updated);
    return updated;
  }
  // Associate methods
  async getAssociates() {
    return Array.from(this.associatesMap.values());
  }
  async getAssociate(id) {
    return this.associatesMap.get(id);
  }
  async createAssociate(insertAssociate) {
    const id = this.currentAssociateId++;
    const associate = { ...insertAssociate, id };
    this.associatesMap.set(id, associate);
    return associate;
  }
  async updateAssociate(id, associate) {
    const existing = this.associatesMap.get(id);
    if (!existing) {
      return void 0;
    }
    const updated = { ...existing, ...associate };
    this.associatesMap.set(id, updated);
    return updated;
  }
  async deleteAssociate(id) {
    return this.associatesMap.delete(id);
  }
  // Mission methods
  async getMissions() {
    return Array.from(this.missionsMap.values());
  }
  async getMissionsByAssociate(associateId) {
    return Array.from(this.missionsMap.values()).filter(
      (mission) => mission.associateId === associateId
    );
  }
  async getMissionsByIndicator(indicatorId) {
    return Array.from(this.missionsMap.values()).filter(
      (mission) => mission.indicatorId === indicatorId
    );
  }
  async getMission(id) {
    return this.missionsMap.get(id);
  }
  async createMission(insertMission) {
    const id = this.currentMissionId++;
    const mission = { ...insertMission, id };
    this.missionsMap.set(id, mission);
    return mission;
  }
  async updateMission(id, mission) {
    const existing = this.missionsMap.get(id);
    if (!existing) {
      return void 0;
    }
    const updated = { ...existing, ...mission };
    this.missionsMap.set(id, updated);
    return updated;
  }
  async deleteMission(id) {
    return this.missionsMap.delete(id);
  }
  // Stats methods
  async getStats() {
    const indicators2 = await this.getIndicators();
    const missions2 = await this.getMissions();
    const coreIndicators = indicators2.filter((i) => i.type === "core");
    const optionalIndicators = indicators2.filter((i) => i.type === "optional");
    const coreIndicatorIds = new Set(coreIndicators.map((i) => i.id));
    const optionalIndicatorIds = new Set(optionalIndicators.map((i) => i.id));
    const coreMissions = missions2.filter((m) => coreIndicatorIds.has(m.indicatorId));
    const optionalMissions = missions2.filter((m) => optionalIndicatorIds.has(m.indicatorId));
    const validatedCoreMissions = coreMissions.filter((m) => m.status === "validated");
    const validatedOptionalMissions = optionalMissions.filter((m) => m.status === "validated");
    const fixedCompensation = validatedCoreMissions.reduce((sum, m) => sum + (m.compensation || 0), 0);
    const variableCompensation = validatedOptionalMissions.reduce((sum, m) => sum + (m.compensation || 0), 0);
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
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var indicatorTypeEnum = pgEnum("indicator_type", ["core", "optional"]);
var indicatorStatusEnum = pgEnum("indicator_status", ["validated", "in_progress", "not_validated"]);
var professionEnum = pgEnum("profession", [
  "doctor",
  "pharmacist",
  "nurse",
  "physiotherapist",
  "other"
]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var indicators = pgTable("indicators", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  // e.g. S01, O01
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: indicatorTypeEnum("type").notNull(),
  // core or optional
  objective: text("objective").notNull(),
  // target to achieve
  maxCompensation: integer("max_compensation").notNull()
  // maximum compensation amount
});
var insertIndicatorSchema = createInsertSchema(indicators).pick({
  code: true,
  name: true,
  description: true,
  type: true,
  objective: true,
  maxCompensation: true
});
var associates = pgTable("associates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profession: professionEnum("profession").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  patientCount: integer("patient_count"),
  // Nombre de patients pour les médecins
  activePatients: integer("active_patients")
  // File active des patients
});
var insertAssociateSchema = createInsertSchema(associates).pick({
  firstName: true,
  lastName: true,
  profession: true,
  email: true,
  phone: true,
  patientCount: true,
  activePatients: true
});
var missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  associateId: integer("associate_id").notNull(),
  indicatorId: integer("indicator_id").notNull(),
  status: indicatorStatusEnum("status").notNull().default("in_progress"),
  currentValue: text("current_value"),
  // current progress towards objective
  compensation: integer("compensation").default(0),
  // actual compensation amount
  notes: text("notes")
});
var insertMissionSchema = createInsertSchema(missions).pick({
  associateId: true,
  indicatorId: true,
  status: true,
  currentValue: true,
  compensation: true,
  notes: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  const apiRouter = express.Router();
  app2.use("/api", apiRouter);
  apiRouter.get("/indicators", async (req, res) => {
    const indicators2 = await storage.getIndicators();
    res.json(indicators2);
  });
  apiRouter.get("/indicators/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const indicator = await storage.getIndicator(id);
    if (!indicator) {
      return res.status(404).json({ message: "Indicator not found" });
    }
    res.json(indicator);
  });
  apiRouter.post("/indicators", async (req, res) => {
    try {
      const data = insertIndicatorSchema.parse(req.body);
      const indicator = await storage.createIndicator(data);
      res.status(201).json(indicator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid indicator data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create indicator" });
    }
  });
  apiRouter.patch("/indicators/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    try {
      const validFields = insertIndicatorSchema.partial().parse(req.body);
      const updated = await storage.updateIndicator(id, validFields);
      if (!updated) {
        return res.status(404).json({ message: "Indicator not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid indicator data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update indicator" });
    }
  });
  apiRouter.get("/associates", async (req, res) => {
    const associates2 = await storage.getAssociates();
    res.json(associates2);
  });
  apiRouter.get("/associates/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const associate = await storage.getAssociate(id);
    if (!associate) {
      return res.status(404).json({ message: "Associate not found" });
    }
    res.json(associate);
  });
  apiRouter.post("/associates", async (req, res) => {
    try {
      const data = insertAssociateSchema.parse(req.body);
      const associate = await storage.createAssociate(data);
      res.status(201).json(associate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid associate data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create associate" });
    }
  });
  apiRouter.patch("/associates/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    try {
      const validFields = insertAssociateSchema.partial().parse(req.body);
      const updated = await storage.updateAssociate(id, validFields);
      if (!updated) {
        return res.status(404).json({ message: "Associate not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid associate data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update associate" });
    }
  });
  apiRouter.delete("/associates/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const success = await storage.deleteAssociate(id);
    if (!success) {
      return res.status(404).json({ message: "Associate not found" });
    }
    res.status(204).send();
  });
  apiRouter.get("/missions", async (req, res) => {
    const missions2 = await storage.getMissions();
    res.json(missions2);
  });
  apiRouter.get("/associates/:id/missions", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const missions2 = await storage.getMissionsByAssociate(id);
    res.json(missions2);
  });
  apiRouter.get("/indicators/:id/missions", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const missions2 = await storage.getMissionsByIndicator(id);
    res.json(missions2);
  });
  apiRouter.get("/missions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const mission = await storage.getMission(id);
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    res.json(mission);
  });
  apiRouter.post("/missions", async (req, res) => {
    try {
      const data = insertMissionSchema.parse(req.body);
      const mission = await storage.createMission(data);
      res.status(201).json(mission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid mission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create mission" });
    }
  });
  apiRouter.patch("/missions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    try {
      const validFields = insertMissionSchema.partial().parse(req.body);
      const updated = await storage.updateMission(id, validFields);
      if (!updated) {
        return res.status(404).json({ message: "Mission not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid mission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update mission" });
    }
  });
  apiRouter.delete("/missions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const success = await storage.deleteMission(id);
    if (!success) {
      return res.status(404).json({ message: "Mission not found" });
    }
    res.status(204).send();
  });
  apiRouter.get("/stats", async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });
  apiRouter.get("/dashboard", async (req, res) => {
    const [stats, indicators2, associates2, missions2] = await Promise.all([
      storage.getStats(),
      storage.getIndicators(),
      storage.getAssociates(),
      storage.getMissions()
    ]);
    res.json({
      stats,
      indicators: indicators2,
      associates: associates2,
      missions: missions2
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: "/ACI-REACT/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
