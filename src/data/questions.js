// The 248 multiple-choice questions from the original HTML quiz (script.js).
// The mock AI service returns these for every uploaded document.
export const SAMPLE_QUESTIONS = [
  {
    "id": "q1",
    "text": "What is the primary focus of industrial chemistry?",
    "options": [
      "Study of astronomical bodies",
      "Application of chemistry to large-scale production",
      "Study of animal behaviour",
      "Study of weather patterns"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "Industrial chemistry applies chemical principles to the large-scale manufacture of useful products."
  },
  {
    "id": "q2",
    "text": "Which factor is especially important when designing an industrial chemical process?",
    "options": [
      "Economic viability and safety",
      "Colour of the factory",
      "Number of laboratory coats",
      "Size of the company logo"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Industrial processes must be economically viable while maintaining safety and product quality."
  },
  {
    "id": "q3",
    "text": "Which two gases are required as reactants in the Haber process?",
    "options": [
      "Oxygen and chlorine",
      "Nitrogen and hydrogen",
      "Carbon dioxide and oxygen",
      "Nitrogen and carbon dioxide"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "The Haber process combines nitrogen and hydrogen to manufacture ammonia."
  },
  {
    "id": "q4",
    "text": "What is the major industrial product of the Haber process?",
    "options": [
      "Ammonia",
      "Sulfuric acid",
      "Sodium carbonate",
      "Nitric acid"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The Haber process is used industrially to manufacture ammonia."
  },
  {
    "id": "q5",
    "text": "Which catalyst is traditionally used in the Haber process?",
    "options": [
      "Nickel",
      "Iron",
      "Copper",
      "Platinum"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "An iron-based catalyst is used in the Haber process."
  },
  {
    "id": "q6",
    "text": "Why is a catalyst useful in an industrial reaction?",
    "options": [
      "It lowers the activation energy",
      "It permanently increases product concentration",
      "It changes the reaction into a physical process",
      "It prevents reactants from reacting"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Catalysts provide an alternative reaction pathway with lower activation energy, increasing reaction rate."
  },
  {
    "id": "q7",
    "text": "Which industrial process is associated with the production of sulfuric acid?",
    "options": [
      "Ostwald process",
      "Contact process",
      "Solvay process",
      "Haber process"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "The Contact process is the major industrial method for producing sulfuric acid."
  },
  {
    "id": "q8",
    "text": "Which catalyst is associated with the Contact process?",
    "options": [
      "Iron",
      "Vanadium(V) oxide",
      "Nickel",
      "Calcium oxide"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "Vanadium(V) oxide is used as the catalyst in the Contact process."
  },
  {
    "id": "q9",
    "text": "Which process is used industrially to manufacture nitric acid?",
    "options": [
      "Haber process",
      "Ostwald process",
      "Contact process",
      "Solvay process"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "The Ostwald process is used for the industrial manufacture of nitric acid."
  },
  {
    "id": "q10",
    "text": "Which chemical is manufactured by the Solvay process?",
    "options": [
      "Sodium carbonate",
      "Sulfuric acid",
      "Ammonia",
      "Nitric acid"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The Solvay process is an important industrial process for producing sodium carbonate."
  },
  {
    "id": "q11",
    "text": "Which gas is important in the Solvay process?",
    "options": [
      "Carbon dioxide",
      "Helium",
      "Hydrogen sulfide",
      "Argon"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Carbon dioxide is introduced during the Solvay process."
  },
  {
    "id": "q12",
    "text": "What is meant by a raw material?",
    "options": [
      "A finished product ready for sale",
      "A starting substance used in production",
      "A waste product",
      "A laboratory contaminant"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "Raw materials are starting substances that undergo physical or chemical processing to produce useful products."
  },
  {
    "id": "q13",
    "text": "Which of the following is a mineral raw material?",
    "options": [
      "Wood",
      "Palm oil",
      "Iron ore",
      "Sugarcane"
    ],
    "correct": 2,
    "points": 5,
    "feedback": "Iron ore is a mineral resource used as an industrial raw material."
  },
  {
    "id": "q14",
    "text": "Which of these is an agricultural raw material?",
    "options": [
      "Limestone",
      "Palm oil",
      "Iron ore",
      "Gypsum"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "Palm oil is obtained from an agricultural resource and can serve as an industrial raw material."
  },
  {
    "id": "q15",
    "text": "Wood is classified as a:",
    "options": [
      "Mineral resource",
      "Forest resource",
      "Synthetic resource",
      "Petrochemical"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "Wood is obtained from forests and is therefore classified as a forest resource."
  },
  {
    "id": "q16",
    "text": "Which of the following is a synthetic industrial material?",
    "options": [
      "Limestone",
      "Wood",
      "Synthetic polymer",
      "Sugarcane"
    ],
    "correct": 2,
    "points": 5,
    "feedback": "Synthetic polymers are manufactured materials rather than naturally occurring raw materials."
  },
  {
    "id": "q17",
    "text": "What is the main characteristic of a unit operation?",
    "options": [
      "It involves a physical change or separation",
      "It always involves combustion",
      "It is always biological",
      "It requires nuclear reactions"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Unit operations are physical steps such as distillation, filtration, drying and evaporation."
  },
  {
    "id": "q18",
    "text": "Which of the following is an example of a unit operation?",
    "options": [
      "Nitration",
      "Hydrogenation",
      "Filtration",
      "Oxidation"
    ],
    "correct": 2,
    "points": 5,
    "feedback": "Filtration is a physical separation technique and is therefore a unit operation."
  },
  {
    "id": "q19",
    "text": "Unit processes are primarily associated with:",
    "options": [
      "Chemical reactions",
      "Only transportation",
      "Packaging only",
      "Physical movement of equipment"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Unit processes involve chemical transformations such as oxidation, reduction, nitration and hydrogenation."
  },
  {
    "id": "q20",
    "text": "Distillation is mainly based on differences in:",
    "options": [
      "Boiling points",
      "Colour",
      "Particle shape",
      "Electrical conductivity"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Distillation separates components because they have different boiling points or volatilities."
  },
  {
    "id": "q21",
    "text": "Which industrial activity commonly makes extensive use of distillation?",
    "options": [
      "Petroleum refining",
      "Wood harvesting",
      "Road construction",
      "Leather stitching"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Distillation is a major separation operation used in petroleum refining."
  },
  {
    "id": "q22",
    "text": "Filtration is most suitable for separating:",
    "options": [
      "Two gases",
      "A solid from a liquid",
      "Two liquids with identical boiling points",
      "Two dissolved gases"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "Filtration separates insoluble solid particles from a fluid, commonly a liquid."
  },
  {
    "id": "q23",
    "text": "Which industrial activity commonly uses filtration?",
    "options": [
      "Water treatment",
      "Nitrogen fixation",
      "Polymerization only",
      "Petroleum drilling"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Filtration is widely used in water treatment to remove suspended solid particles."
  },
  {
    "id": "q24",
    "text": "The main purpose of industrial drying is to:",
    "options": [
      "Remove moisture",
      "Add nitrogen",
      "Increase acidity",
      "Produce oxygen"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Drying removes moisture from a material and is widely used in food and fertilizer industries."
  },
  {
    "id": "q25",
    "text": "Crystallization is commonly used to obtain:",
    "options": [
      "Solid crystals from solutions",
      "Gases from gases",
      "Liquid metals from air",
      "Polymers from wood"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Crystallization forms solid crystals from a solution, often by cooling or removing solvent."
  },
  {
    "id": "q26",
    "text": "Which industrial product can be obtained through crystallization?",
    "options": [
      "Salt",
      "Crude oil",
      "Natural gas",
      "Wood"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Salt production commonly involves evaporation and crystallization."
  },
  {
    "id": "q27",
    "text": "Evaporation is mainly used to:",
    "options": [
      "Concentrate a solution",
      "Add oxygen to metals",
      "Separate gases by density",
      "Create mechanical pressure"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Evaporation removes solvent from a solution, increasing the concentration of the remaining material."
  },
  {
    "id": "q28",
    "text": "Which industry commonly uses evaporation during processing?",
    "options": [
      "Sugar industry",
      "Automobile repair",
      "Steel welding",
      "Timber transportation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Evaporation is an important operation in sugar manufacturing."
  },
  {
    "id": "q29",
    "text": "Which of the following is a unit process rather than a unit operation?",
    "options": [
      "Filtration",
      "Distillation",
      "Nitration",
      "Drying"
    ],
    "correct": 2,
    "points": 5,
    "feedback": "Nitration involves a chemical reaction and is therefore a unit process."
  },
  {
    "id": "q30",
    "text": "Oxidation may be described as:",
    "options": [
      "Addition of oxygen or removal of hydrogen",
      "Addition of hydrogen only",
      "Removal of solvent",
      "Formation of crystals"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Oxidation can involve addition of oxygen or removal of hydrogen from a substance."
  },
  {
    "id": "q31",
    "text": "Reduction may involve:",
    "options": [
      "Addition of oxygen",
      "Removal of oxygen or addition of hydrogen",
      "Removal of all carbon",
      "Formation of salt crystals"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "Reduction may involve removal of oxygen or addition of hydrogen."
  },
  {
    "id": "q32",
    "text": "Iron extraction from an ore can involve:",
    "options": [
      "Reduction",
      "Nitration",
      "Crystallization",
      "Evaporation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Iron compounds in ores are reduced to produce metallic iron."
  },
  {
    "id": "q33",
    "text": "Nitration involves the introduction of which functional group?",
    "options": [
      "Hydroxyl group",
      "Nitro group",
      "Carboxyl group",
      "Amino group"
    ],
    "correct": 1,
    "points": 5,
    "feedback": "Nitration introduces the nitro group, –NO₂, into a compound."
  },
  {
    "id": "q34",
    "text": "Nitration is associated with the manufacture of:",
    "options": [
      "Explosives",
      "Glass only",
      "Cement only",
      "Leather"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Nitration reactions are used in the manufacture of various industrial chemicals including some explosives."
  },
  {
    "id": "q35",
    "text": "Hydrogenation involves:",
    "options": [
      "Addition of hydrogen",
      "Removal of hydrogen",
      "Addition of chlorine only",
      "Removal of oxygen only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydrogenation is a chemical process in which hydrogen is added to suitable unsaturated compounds."
  },
  {
    "id": "q36",
    "text": "Hydrogenation of vegetable oils is used in the production of:",
    "options": [
      "Margarine",
      "Cement",
      "Glass",
      "Sulfuric acid"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydrogenation can convert unsaturated vegetable oils into more saturated fats used in products such as margarine."
  },
  {
    "id": "q37",
    "text": "Sulfuric acid is widely known as the:",
    "options": [
      "King of Chemicals",
      "King of Polymers",
      "Master of Metals",
      "Queen of Fertilizers"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Sulfuric acid is traditionally called the King of Chemicals because of its extensive industrial applications."
  },
  {
    "id": "q38",
    "text": "Which of these is an important use of sulfuric acid?",
    "options": [
      "Fertilizer production",
      "Petroleum refining",
      "Battery manufacture",
      "All of the above"
    ],
    "correct": 3,
    "points": 5,
    "feedback": "Sulfuric acid is used in fertilizer production, petroleum refining and lead-acid batteries."
  },
  {
    "id": "q39",
    "text": "Which substance was identified as a raw material associated with the sulfuric acid industry?",
    "options": [
      "Gypsum",
      "Cotton",
      "Starch",
      "Natural rubber"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Gypsum was identified in the supplied material as a raw material associated with the sulfuric acid industry."
  },
  {
    "id": "q40",
    "text": "Petrochemicals are mainly derived from:",
    "options": [
      "Petroleum and natural gas",
      "Wood and cotton",
      "Limestone and clay",
      "Sugarcane and starch"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Petrochemicals are chemicals derived mainly from petroleum and natural gas."
  },
  {
    "id": "q41",
    "text": "Which of the following is a primary petrochemical?",
    "options": [
      "Ethylene",
      "Plastic chair",
      "Cement",
      "Glass"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Ethylene is an important primary petrochemical used to manufacture numerous downstream products."
  },
  {
    "id": "q42",
    "text": "Propylene is classified as:",
    "options": [
      "A primary petrochemical",
      "A mineral ore",
      "A fertilizer",
      "A ceramic"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Propylene is one of the major primary petrochemicals obtained from petroleum-related processing."
  },
  {
    "id": "q43",
    "text": "Which of the following is a downstream product of the petrochemical industry?",
    "options": [
      "Plastic",
      "Crude oil",
      "Natural gas",
      "Iron ore"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Plastics are manufactured from petrochemical feedstocks and are downstream petrochemical products."
  },
  {
    "id": "q44",
    "text": "What is the main purpose of quality control?",
    "options": [
      "Ensure products meet specified requirements",
      "Increase defects",
      "Avoid all testing",
      "Increase waste"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Quality control uses inspection, testing and analysis to ensure that products meet required specifications."
  },
  {
    "id": "q45",
    "text": "Which activity is directly associated with quality control?",
    "options": [
      "Testing and analysis",
      "Random production",
      "Ignoring specifications",
      "Avoiding measurements"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Testing and analysis are important quality control activities used to assess products and processes."
  },
  {
    "id": "q46",
    "text": "A product specification defines:",
    "options": [
      "Requirements the product must satisfy",
      "The factorys colour",
      "The number of employees",
      "The companys advertising budget"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A specification states defined requirements or standards that a product must meet."
  },
  {
    "id": "q47",
    "text": "Quality assurance is mainly concerned with:",
    "options": [
      "Planned and systematic activities for achieving quality",
      "Testing finished products only",
      "Increasing defects",
      "Reducing product specifications"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Quality assurance involves planned and systematic activities intended to provide confidence that quality requirements will be fulfilled."
  },
  {
    "id": "q48",
    "text": "Which organization was identified as having a regulatory role in regulated products?",
    "options": [
      "NAFDAC",
      "FIFA",
      "NIMASA",
      "FAO"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The supplied material identifies NAFDAC as having responsibility for regulating relevant products to ensure quality, safety and efficacy."
  },
  {
    "id": "q49",
    "text": "Which of the following is an important consideration in industrial product development?",
    "options": [
      "Quality requirements",
      "Ignoring safety",
      "Increasing waste deliberately",
      "Avoiding process control"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Industrial product development must consider quality and other requirements such as safety and process performance."
  },
  {
    "id": "q50",
    "text": "Soaps are generally produced from fatty materials and:",
    "options": [
      "Alkali",
      "Silica sand",
      "Iron ore",
      "Natural gas only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Soap production generally involves the reaction of fats or oils with an alkali."
  },
  {
    "id": "q51",
    "text": "Synthetic detergents contain:",
    "options": [
      "Synthetic surfactants",
      "Only mineral ores",
      "Only proteins",
      "Only natural rubber"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Synthetic detergents contain manufactured surfactants that help reduce surface tension and remove dirt."
  },
  {
    "id": "q52",
    "text": "Why can synthetic detergents be advantageous in hard water?",
    "options": [
      "They generally remain effective without forming the same insoluble scum as soaps",
      "They turn water into oil",
      "They cannot dissolve in water",
      "They contain no surfactants"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Many synthetic detergents remain effective in hard water, whereas soaps can form insoluble scum with calcium and magnesium ions."
  },
  {
    "id": "q53",
    "text": "Fertilizers are broadly classified into:",
    "options": [
      "Organic and inorganic",
      "Metallic and gaseous only",
      "Acidic and radioactive",
      "Natural and magnetic"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The supplied material broadly classifies fertilizers as organic and inorganic fertilizers."
  },
  {
    "id": "q54",
    "text": "Urea belongs to which fertilizer category?",
    "options": [
      "Nitrogenous fertilizer",
      "Potassium fertilizer",
      "Lime fertilizer",
      "Phosphate rock"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Urea is a nitrogenous fertilizer because it supplies nitrogen to plants."
  },
  {
    "id": "q55",
    "text": "The industrial manufacture of urea uses:",
    "options": [
      "Ammonia and carbon dioxide",
      "Sulfur and oxygen",
      "Sodium chloride and chlorine",
      "Silica and gypsum"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Urea is manufactured industrially from ammonia and carbon dioxide."
  },
  {
    "id": "q56",
    "text": "The major nutrient supplied by nitrogenous fertilizers is:",
    "options": [
      "Nitrogen",
      "Silicon",
      "Chlorine",
      "Helium"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Nitrogenous fertilizers supply nitrogen, an important nutrient required for plant growth."
  },
  {
    "id": "q57",
    "text": "Excessive use of nitrogenous fertilizers may contribute to:",
    "options": [
      "Environmental problems from nutrient losses",
      "Complete removal of water",
      "Permanent prevention of plant growth",
      "Elimination of all soil nutrients"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Excess nutrients can be lost to the environment and may contribute to environmental problems."
  },
  {
    "id": "q58",
    "text": "Which material is a major raw material for ordinary glass?",
    "options": [
      "Silica sand",
      "Urea",
      "Leather",
      "Vegetable oil"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Silica sand is a major source of silica used in ordinary glass manufacture."
  },
  {
    "id": "q59",
    "text": "What is done to glass raw materials before melting?",
    "options": [
      "They are prepared and mixed",
      "They are converted into leather",
      "They are hydrogenated",
      "They are fermented"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Glass manufacture begins with preparation and mixing of the appropriate raw materials before melting."
  },
  {
    "id": "q60",
    "text": "Which is an important application of glass?",
    "options": [
      "Construction",
      "Leather tanning",
      "Fertilizer decomposition",
      "Iron extraction"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Glass is widely used in construction, among many other industrial applications."
  },
  {
    "id": "q61",
    "text": "The dry process of cement manufacture involves:",
    "options": [
      "Dry preparation of the raw-material mixture",
      "Using only liquid raw materials",
      "No heating",
      "Using vegetable oil as the main raw material"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "In the dry process, raw materials are prepared as a dry mixture before being subjected to high-temperature processing."
  },
  {
    "id": "q62",
    "text": "What is produced when cement raw materials are heated to high temperature?",
    "options": [
      "Cement clinker",
      "Urea",
      "Margarine",
      "Natural rubber"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "High-temperature treatment of the cement raw-material mixture produces cement clinker."
  },
  {
    "id": "q63",
    "text": "Cement hydration occurs when cement compounds react with:",
    "options": [
      "Water",
      "Nitrogen",
      "Sulfur",
      "Carbon monoxide"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydration is the reaction of cement compounds with water, leading to hardening and strength development."
  },
  {
    "id": "q64",
    "text": "Which cement compounds were identified as reacting with water during hydration?",
    "options": [
      "C₃S and C₂S",
      "NaCl and KCl",
      "NH₃ and CO₂",
      "SiO₂ and NaCl only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The supplied material specifically identifies C₃S and C₂S as cement compounds involved in hydration with water."
  },
  {
    "id": "q65",
    "text": "A major environmental issue associated with cement production is:",
    "options": [
      "Air pollution and dust emissions",
      "Complete removal of carbon dioxide",
      "Production of pure oxygen",
      "Elimination of all waste"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Cement production can generate dust and air emissions, making environmental management important."
  },
  {
    "id": "q66",
    "text": "What happens to unsaturated bonds during hydrogenation of vegetable oils?",
    "options": [
      "Hydrogen is added to them",
      "All carbon is removed",
      "They become silica",
      "They are converted into water"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydrogenation adds hydrogen across unsaturated bonds in the oil."
  },
  {
    "id": "q67",
    "text": "Which polymer is formed from ethene?",
    "options": [
      "Polyethylene",
      "Bakelite",
      "Nylon",
      "PVC"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Ethene undergoes addition polymerization to form polyethylene."
  },
  {
    "id": "q68",
    "text": "The monomer used to produce PVC is:",
    "options": [
      "Vinyl chloride",
      "Ethane",
      "Styrene only",
      "Benzene"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "PVC is produced through polymerization of vinyl chloride."
  },
  {
    "id": "q69",
    "text": "Bakelite is classified as a:",
    "options": [
      "Thermosetting polymer",
      "Thermoplastic",
      "Natural rubber",
      "Metal alloy"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Bakelite is a thermosetting polymer that forms a permanent structure when cured."
  },
  {
    "id": "q70",
    "text": "Natural rubber is obtained from:",
    "options": [
      "Latex",
      "Limestone",
      "Coal",
      "Silica sand"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Natural rubber is obtained from latex produced by rubber plants."
  },
  {
    "id": "q71",
    "text": "The purpose of vulcanization is to:",
    "options": [
      "Improve the properties of rubber",
      "Convert rubber into glass",
      "Remove all sulfur",
      "Produce crude oil"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Vulcanization improves rubber properties and involves the use of sulfur."
  },
  {
    "id": "q72",
    "text": "Which element is commonly added during vulcanization?",
    "options": [
      "Sulfur",
      "Helium",
      "Sodium",
      "Calcium"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Sulfur is used during vulcanization to improve the properties of natural rubber."
  },
  {
    "id": "q73",
    "text": "Crude oil is separated into useful fractions mainly by:",
    "options": [
      "Fractional distillation",
      "Filtration",
      "Drying",
      "Crystallization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Fractional distillation separates crude oil into fractions according to differences in boiling ranges."
  },
  {
    "id": "q74",
    "text": "Which crude oil fraction is identified as the lightest in the supplied material?",
    "options": [
      "Refinery gas",
      "Diesel",
      "Bitumen",
      "Lubricating oil"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The supplied material identifies refinery gas as the lightest fraction obtained from crude oil."
  },
  {
    "id": "q75",
    "text": "Catalytic cracking is used to convert:",
    "options": [
      "Large hydrocarbons into smaller hydrocarbons",
      "Small hydrocarbons into larger ones",
      "Alcohols into proteins",
      "Acids into metals"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Catalytic cracking breaks larger hydrocarbon molecules into smaller, more useful hydrocarbons."
  },
  {
    "id": "q76",
    "text": "Which of the following is an example of a heavy chemical?",
    "options": [
      "A bulk industrial chemical produced in large quantities",
      "A rare laboratory sample only",
      "A biological cell",
      "A food flavouring only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Heavy chemicals are generally manufactured in large quantities for broad industrial use."
  },
  {
    "id": "q77",
    "text": "Fine chemicals are generally characterized by:",
    "options": [
      "Smaller production quantities and specific purity requirements",
      "Production only from limestone",
      "No quality specifications",
      "Exclusive use as fuels"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Fine chemicals are often produced in smaller quantities and to precise purity or specification requirements."
  },
  {
    "id": "q78",
    "text": "Which statement best describes a continuous industrial process?",
    "options": [
      "Materials are continuously fed and products continuously removed",
      "Production occurs only once",
      "No raw materials are required",
      "The process has no equipment"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A continuous process operates with ongoing feed and product removal."
  },
  {
    "id": "q79",
    "text": "A batch process involves:",
    "options": [
      "Processing a measured quantity of material as a separate lot",
      "Continuous product removal only",
      "No raw materials",
      "Only manual laboratory experiments"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Batch processing handles a defined quantity of material during each production cycle."
  },
  {
    "id": "q80",
    "text": "Which process type generally produces materials in separate lots?",
    "options": [
      "Batch process",
      "Continuous process",
      "Open atmospheric process",
      "Distillation column only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Batch processes manufacture products in separate, measured lots."
  },
  {
    "id": "q81",
    "text": "One major advantage of continuous processing is:",
    "options": [
      "High productivity",
      "No need for maintenance",
      "Zero energy consumption",
      "No need for control"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Continuous processes can achieve high productivity because production can proceed continuously."
  },
  {
    "id": "q82",
    "text": "Industrial automation is intended to:",
    "options": [
      "Reduce human intervention in routine operations",
      "Eliminate all equipment",
      "Stop chemical reactions",
      "Increase manual work"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Automation uses control systems and equipment to perform operations with reduced human intervention."
  },
  {
    "id": "q83",
    "text": "What is the main purpose of process control?",
    "options": [
      "Maintain desired operating conditions",
      "Increase uncontrolled waste",
      "Stop all production",
      "Remove all operators"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Process control maintains important operating variables within desired ranges."
  },
  {
    "id": "q84",
    "text": "Which device is commonly used to measure pH in an industrial process?",
    "options": [
      "pH meter",
      "Hydrometer",
      "Thermometer",
      "Barometer"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A pH meter is commonly used to determine the acidity or alkalinity of a solution."
  },
  {
    "id": "q85",
    "text": "ISO 9001 is primarily associated with:",
    "options": [
      "Quality management systems",
      "Water hardness",
      "Fuel combustion only",
      "Mining"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "ISO 9001 specifies requirements for quality management systems."
  },
  {
    "id": "q86",
    "text": "Good Manufacturing Practice is commonly abbreviated as:",
    "options": [
      "GMP",
      "EIA",
      "CSTR",
      "PVC"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Good Manufacturing Practice is abbreviated as GMP."
  },
  {
    "id": "q87",
    "text": "GMP is important because it helps ensure:",
    "options": [
      "Product quality and safety",
      "Higher product defects",
      "No documentation",
      "Uncontrolled production"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "GMP provides principles and practices that support consistent product quality and safety."
  },
  {
    "id": "q88",
    "text": "Which substance mainly causes water hardness?",
    "options": [
      "Calcium and magnesium ions",
      "Sodium ions only",
      "Hydrogen gas",
      "Oxygen gas"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Water hardness is mainly associated with dissolved calcium and magnesium ions."
  },
  {
    "id": "q89",
    "text": "Temporary hardness of water can be reduced by:",
    "options": [
      "Boiling",
      "Freezing",
      "Filtration only",
      "Adding oxygen"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Temporary hardness can be reduced by boiling because bicarbonates responsible for it can decompose."
  },
  {
    "id": "q90",
    "text": "The chlor-alkali process uses which major raw material?",
    "options": [
      "Brine",
      "Crude oil",
      "Limestone only",
      "Wood"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The chlor-alkali process uses concentrated sodium chloride solution, commonly called brine."
  },
  {
    "id": "q91",
    "text": "Which products are obtained from the chlor-alkali process?",
    "options": [
      "Sodium hydroxide, chlorine and hydrogen",
      "Sulfuric acid and ammonia",
      "Urea and nitric acid",
      "Glass and cement"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Electrolysis of brine produces sodium hydroxide, chlorine and hydrogen."
  },
  {
    "id": "q92",
    "text": "During electrolysis of brine, chlorine is produced at the:",
    "options": [
      "Anode",
      "Cathode",
      "Salt bridge",
      "Membrane only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Chloride ions are oxidized at the anode to produce chlorine gas."
  },
  {
    "id": "q93",
    "text": "The corrosion of iron is commonly called:",
    "options": [
      "Rusting",
      "Galvanizing",
      "Hydration",
      "Vulcanization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The corrosion of iron is commonly referred to as rusting."
  },
  {
    "id": "q94",
    "text": "Which method can protect iron or steel from corrosion?",
    "options": [
      "Painting or coating",
      "Constant exposure to water",
      "Adding salt",
      "Increasing oxygen exposure"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Protective coatings can isolate the metal surface from moisture and oxygen and reduce corrosion."
  },
  {
    "id": "q95",
    "text": "Galvanizing protects steel by coating it with:",
    "options": [
      "Zinc",
      "Copper",
      "Silver",
      "Aluminium oxide only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Galvanizing involves coating iron or steel with zinc to provide corrosion protection."
  },
  {
    "id": "q96",
    "text": "Chromium is added to stainless steel mainly to improve:",
    "options": [
      "Corrosion resistance",
      "Water hardness",
      "Fuel content",
      "Solubility in water"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Chromium contributes to the corrosion resistance that characterizes stainless steel."
  },
  {
    "id": "q97",
    "text": "What is the purpose of a heat exchanger?",
    "options": [
      "Transfer heat between fluids",
      "Store solid chemicals permanently",
      "Measure pH",
      "Separate solids by filtration"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Heat exchangers transfer thermal energy between fluids without necessarily mixing them."
  },
  {
    "id": "q98",
    "text": "Which type of force is associated with particle separation in a cyclone separator?",
    "options": [
      "Centrifugal force",
      "Magnetic force",
      "Nuclear force",
      "Buoyant force only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Cyclone separators use centrifugal effects to separate particles from a flowing gas or fluid."
  },
  {
    "id": "q99",
    "text": "A cyclone separator is mainly used to remove:",
    "options": [
      "Particles from a gas stream",
      "Dissolved salts from water",
      "Hydrogen from ammonia",
      "Sugar from crystals"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Cyclone separators remove suspended particles from gas streams using centrifugal action."
  },
  {
    "id": "q100",
    "text": "Which gas was identified as a major greenhouse gas emitted by many industries?",
    "options": [
      "Carbon dioxide",
      "Nitrogen",
      "Helium",
      "Argon"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Carbon dioxide is a major greenhouse gas associated with many industrial activities."
  },
  {
    "id": "q101",
    "text": "The abbreviation EIA stands for:",
    "options": [
      "Environmental Impact Assessment",
      "Energy Industrial Analysis",
      "Environmental Industrial Automation",
      "Economic Industry Application"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "EIA stands for Environmental Impact Assessment."
  },
  {
    "id": "q102",
    "text": "An Environmental Impact Assessment is generally carried out:",
    "options": [
      "Before major projects commence",
      "Only after a factory closes",
      "Only after pollution occurs",
      "After all products are sold"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "EIA is used before major projects to assess potential environmental effects and inform planning."
  },
  {
    "id": "q103",
    "text": "Which law is associated with heat conduction calculations?",
    "options": [
      "Fourier’s law",
      "Boyle’s law",
      "Graham’s law",
      "Charles’s law"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Fourier’s law describes heat conduction and is used in heat-transfer calculations."
  },
  {
    "id": "q104",
    "text": "A Continuous Stirred Tank Reactor is commonly abbreviated as:",
    "options": [
      "CSTR",
      "GMP",
      "EIA",
      "PVC"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "CSTR stands for Continuous Stirred Tank Reactor."
  },
  {
    "id": "q105",
    "text": "A CSTR is designed for:",
    "options": [
      "Continuous mixing and reaction",
      "Only solid filtration",
      "Crude oil storage",
      "Manual packaging"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A CSTR continuously receives feed while its contents are mixed and reaction takes place."
  },
  {
    "id": "q106",
    "text": "Which operation would be most appropriate for removing suspended solids from water?",
    "options": [
      "Filtration",
      "Hydrogenation",
      "Nitration",
      "Polymerization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Filtration is appropriate for removing suspended solid particles from water."
  },
  {
    "id": "q107",
    "text": "Which operation is particularly suitable for separating liquids with different boiling points?",
    "options": [
      "Distillation",
      "Filtration",
      "Drying",
      "Grinding"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Distillation separates liquids based on differences in volatility and boiling points."
  },
  {
    "id": "q108",
    "text": "Which operation removes water or another solvent to increase concentration?",
    "options": [
      "Evaporation",
      "Nitration",
      "Reduction",
      "Vulcanization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Evaporation removes solvent and leaves behind a more concentrated solution."
  },
  {
    "id": "q109",
    "text": "Which process produces solid crystals from a solution?",
    "options": [
      "Crystallization",
      "Hydrogenation",
      "Oxidation",
      "Polymerization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Crystallization produces solid crystals from a solution under suitable conditions."
  },
  {
    "id": "q110",
    "text": "Which of the following is a physical separation method?",
    "options": [
      "Distillation",
      "Nitration",
      "Oxidation",
      "Hydrogenation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Distillation is a physical separation process and does not require a chemical transformation of the components."
  },
  {
    "id": "q111",
    "text": "Which of the following is a chemical transformation?",
    "options": [
      "Hydrogenation",
      "Filtration",
      "Drying",
      "Distillation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydrogenation involves a chemical reaction in which hydrogen is added to a compound."
  },
  {
    "id": "q112",
    "text": "Which process changes large hydrocarbon molecules into smaller ones?",
    "options": [
      "Cracking",
      "Crystallization",
      "Filtration",
      "Drying"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Cracking breaks large hydrocarbon molecules into smaller hydrocarbons."
  },
  {
    "id": "q113",
    "text": "Why is cracking important in petroleum processing?",
    "options": [
      "It produces smaller, useful hydrocarbons from heavier fractions",
      "It produces only water",
      "It removes all carbon",
      "It converts hydrocarbons into metals"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Cracking increases the usefulness of heavier petroleum fractions by producing smaller hydrocarbons."
  },
  {
    "id": "q114",
    "text": "Which of the following is a polymerization product of ethene?",
    "options": [
      "Polyethylene",
      "Sulfuric acid",
      "Ammonia",
      "Sodium carbonate"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Ethene molecules join together through polymerization to form polyethylene."
  },
  {
    "id": "q115",
    "text": "Polyethylene is an example of:",
    "options": [
      "A polymer",
      "A mineral ore",
      "A fertilizer salt",
      "A metal alloy"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Polyethylene is a synthetic polymer produced from ethene."
  },
  {
    "id": "q116",
    "text": "PVC is an abbreviation for:",
    "options": [
      "Polyvinyl chloride",
      "Polyvinyl carbonate",
      "Petroleum vapour compound",
      "Polyester vinyl carbon"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "PVC stands for polyvinyl chloride."
  },
  {
    "id": "q117",
    "text": "Which category does Bakelite belong to?",
    "options": [
      "Thermosetting polymers",
      "Thermoplastic polymers",
      "Natural minerals",
      "Petrochemical gases"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Bakelite is a thermosetting polymer."
  },
  {
    "id": "q118",
    "text": "What is the main difference between addition and condensation polymerization?",
    "options": [
      "Condensation polymerization may eliminate small molecules",
      "Addition polymerization always produces water",
      "Neither process forms polymers",
      "Both always produce oxygen"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Addition polymerization generally occurs without eliminating small molecules, while condensation polymerization may eliminate molecules such as water."
  },
  {
    "id": "q119",
    "text": "Which type of polymerization generally involves unsaturated monomers?",
    "options": [
      "Addition polymerization",
      "Condensation polymerization only",
      "Hydration polymerization",
      "Reduction polymerization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Addition polymerization commonly involves unsaturated monomers such as alkenes."
  },
  {
    "id": "q120",
    "text": "What is the major role of industrial chemistry in society?",
    "options": [
      "Production of useful materials and chemicals at scale",
      "Elimination of chemical processes",
      "Study of planets",
      "Production of only laboratory samples"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Industrial chemistry helps transform raw materials into useful products through large-scale chemical processes."
  },
  {
    "id": "q121",
    "text": "Which factor can influence the choice of an industrial process?",
    "options": [
      "Cost, safety and product quality",
      "Factory colour only",
      "Number of offices",
      "Employee uniforms"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Industrial process selection considers factors such as cost, safety, efficiency and product quality."
  },
  {
    "id": "q122",
    "text": "Why is process efficiency important in industrial chemistry?",
    "options": [
      "It helps reduce waste and production costs",
      "It eliminates the need for raw materials",
      "It prevents all chemical reactions",
      "It increases unnecessary waste"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Efficient processes can improve productivity while reducing waste, energy use and production costs."
  },
  {
    "id": "q123",
    "text": "Why are industrial chemical processes subject to quality specifications?",
    "options": [
      "To ensure consistent product quality",
      "To increase defects",
      "To eliminate testing",
      "To make products unpredictable"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Specifications provide measurable requirements that help maintain consistent product quality."
  },
  {
    "id": "q124",
    "text": "Which activity helps determine whether an industrial product meets its specification?",
    "options": [
      "Testing and analysis",
      "Guessing",
      "Ignoring measurements",
      "Random dilution"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Testing and analysis provide evidence that a product meets its specified requirements."
  },
  {
    "id": "q125",
    "text": "Which is an example of an agricultural material that can serve as an industrial feedstock?",
    "options": [
      "Starch",
      "Iron ore",
      "Limestone",
      "Gypsum"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Starch is an agricultural resource that can be used as an industrial raw material."
  },
  {
    "id": "q126",
    "text": "Which of the following is a forest-derived material?",
    "options": [
      "Wood",
      "Urea",
      "Iron ore",
      "Silica sand"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Wood is a forest resource used in numerous industrial processes."
  },
  {
    "id": "q127",
    "text": "Which of these belongs to mineral resources?",
    "options": [
      "Phosphate rock",
      "Palm oil",
      "Wood",
      "Natural rubber"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Phosphate rock is a mineral raw material used in industrial and fertilizer production."
  },
  {
    "id": "q128",
    "text": "Which of the following is NOT a natural raw material?",
    "options": [
      "Synthetic polymer",
      "Clay",
      "Iron ore",
      "Sugarcane"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Synthetic polymers are manufactured materials rather than natural raw materials."
  },
  {
    "id": "q129",
    "text": "What is the purpose of drying in fertilizer production?",
    "options": [
      "Remove moisture from the product",
      "Add carbon dioxide",
      "Produce oxygen",
      "Convert fertilizer into metal"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Drying can remove moisture from fertilizer products and improve their handling and storage properties."
  },
  {
    "id": "q130",
    "text": "Which industrial product can involve both evaporation and crystallization?",
    "options": [
      "Sugar",
      "Steel",
      "Natural rubber",
      "Crude oil"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Sugar manufacture can involve evaporation to concentrate solutions followed by crystallization."
  },
  {
    "id": "q131",
    "text": "Which operation is used to concentrate a sugar solution?",
    "options": [
      "Evaporation",
      "Nitration",
      "Hydrogenation",
      "Oxidation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Evaporation removes solvent from sugar solutions and increases their concentration."
  },
  {
    "id": "q132",
    "text": "Which industrial operation is used to recover crystals from a concentrated solution?",
    "options": [
      "Crystallization",
      "Filtration only",
      "Oxidation",
      "Hydrogenation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Crystallization allows dissolved substances to form recoverable solid crystals."
  },
  {
    "id": "q133",
    "text": "Which chemical process involves the removal of oxygen from a substance?",
    "options": [
      "Reduction",
      "Oxidation",
      "Nitration",
      "Evaporation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Removal of oxygen is one of the classical descriptions of reduction."
  },
  {
    "id": "q134",
    "text": "Which chemical process involves the addition of oxygen?",
    "options": [
      "Oxidation",
      "Reduction",
      "Drying",
      "Crystallization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Addition of oxygen is a classical description of oxidation."
  },
  {
    "id": "q135",
    "text": "Which functional group is introduced during nitration?",
    "options": [
      "–NO₂",
      "–OH",
      "–COOH",
      "–NH₂"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Nitration introduces the nitro group, represented as –NO₂."
  },
  {
    "id": "q136",
    "text": "Which process is directly involved in making some partially saturated fats?",
    "options": [
      "Hydrogenation",
      "Nitration",
      "Distillation",
      "Filtration"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydrogenation adds hydrogen to unsaturated bonds and can be used to produce partially saturated fats."
  },
  {
    "id": "q137",
    "text": "Why is sulfuric acid important to industry?",
    "options": [
      "It has many industrial applications",
      "It is used only as a laboratory indicator",
      "It cannot react with other substances",
      "It is only used for glass cleaning"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Sulfuric acid has extensive applications including fertilizer manufacture, petroleum processing and batteries."
  },
  {
    "id": "q138",
    "text": "Which industry makes extensive use of sulfuric acid?",
    "options": [
      "Fertilizer industry",
      "Textile sewing only",
      "Timber harvesting only",
      "Road transport only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Sulfuric acid is an important chemical in fertilizer production."
  },
  {
    "id": "q139",
    "text": "Which raw material is associated with glass manufacture?",
    "options": [
      "Silica sand",
      "Urea",
      "Natural rubber",
      "Ammonia"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Silica sand supplies silica, a major component of ordinary glass."
  },
  {
    "id": "q140",
    "text": "What happens to the prepared raw materials during glass manufacture?",
    "options": [
      "They are melted at high temperature",
      "They are frozen",
      "They are fermented",
      "They are vulcanized"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Prepared glass raw materials are melted at high temperature to form molten glass."
  },
  {
    "id": "q141",
    "text": "What is clinker in cement manufacture?",
    "options": [
      "A high-temperature product formed from cement raw materials",
      "A liquid fertilizer",
      "A type of detergent",
      "A natural rubber product"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Cement clinker is produced by heating the prepared cement raw-material mixture at high temperature."
  },
  {
    "id": "q142",
    "text": "What is one important result of cement hydration?",
    "options": [
      "Hardening of cement",
      "Production of crude oil",
      "Formation of rubber latex",
      "Production of sodium carbonate"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydration reactions contribute to the setting and hardening of cement."
  },
  {
    "id": "q143",
    "text": "Why is environmental control important in the cement industry?",
    "options": [
      "To reduce dust and air pollution",
      "To increase emissions",
      "To eliminate cement production",
      "To increase raw-material waste"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Environmental controls help reduce dust and other emissions associated with cement production."
  },
  {
    "id": "q144",
    "text": "What is the primary purpose of a protective coating on a metal?",
    "options": [
      "Prevent contact with corrosive agents",
      "Increase corrosion",
      "Add water to the surface",
      "Remove the metal completely"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Protective coatings act as barriers that reduce contact between the metal and corrosive environmental agents."
  },
  {
    "id": "q145",
    "text": "Which metal is used to galvanize steel?",
    "options": [
      "Zinc",
      "Iron",
      "Lead",
      "Mercury"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Zinc is used as the protective coating in galvanization."
  },
  {
    "id": "q146",
    "text": "Which property makes stainless steel useful in many industrial environments?",
    "options": [
      "High corrosion resistance",
      "High tendency to rust",
      "Complete solubility in water",
      "Low resistance to chemicals"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Stainless steel is valued partly for its resistance to corrosion."
  },
  {
    "id": "q147",
    "text": "Which instrument would be most suitable for measuring temperature in an industrial process?",
    "options": [
      "Thermometer",
      "pH meter",
      "Hydrometer",
      "Cyclone separator"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A thermometer is used to measure temperature."
  },
  {
    "id": "q148",
    "text": "Which instrument is designed to measure the acidity or alkalinity of a solution?",
    "options": [
      "pH meter",
      "Thermometer",
      "Heat exchanger",
      "Cyclone separator"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A pH meter measures the pH of a solution."
  },
  {
    "id": "q149",
    "text": "What does automation allow an industrial plant to do?",
    "options": [
      "Perform many operations with reduced manual intervention",
      "Eliminate process monitoring",
      "Prevent all chemical reactions",
      "Operate without equipment"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Automation uses control systems to operate and regulate industrial processes with reduced manual intervention."
  },
  {
    "id": "q150",
    "text": "Why is process control important in continuous production?",
    "options": [
      "It helps maintain stable operating conditions",
      "It prevents all production",
      "It removes the need for measurements",
      "It deliberately increases process instability"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Process control helps keep variables such as temperature, pressure and flow within desired ranges."
  },
  {
    "id": "q151",
    "text": "Which reactor type is continuously stirred?",
    "options": [
      "CSTR",
      "Batch reactor",
      "Storage tank",
      "Cyclone separator"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A Continuous Stirred Tank Reactor (CSTR) is designed for continuous mixing and reaction."
  },
  {
    "id": "q152",
    "text": "What is continuously introduced into a continuous reactor?",
    "options": [
      "Feed or reactants",
      "Only finished products",
      "Waste packaging",
      "Solid metal only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Continuous reactors receive feed materials continuously while products are removed continuously or as appropriate."
  },
  {
    "id": "q153",
    "text": "Which separation technique is commonly used in petroleum refining?",
    "options": [
      "Fractional distillation",
      "Hand sorting",
      "Paper chromatography only",
      "Freezing"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Fractional distillation is a major operation in petroleum refining."
  },
  {
    "id": "q154",
    "text": "What determines the order in which crude oil fractions separate during fractional distillation?",
    "options": [
      "Differences in boiling ranges",
      "Colour alone",
      "Density alone",
      "Electrical charge only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Fractions separate according to differences in boiling ranges and volatility."
  },
  {
    "id": "q155",
    "text": "Which fraction is associated with the heavier end of crude oil refining?",
    "options": [
      "Bitumen",
      "Refinery gas",
      "Hydrogen gas",
      "Oxygen"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Bitumen is a heavy petroleum fraction obtained from crude oil processing."
  },
  {
    "id": "q156",
    "text": "What is one purpose of catalytic cracking?",
    "options": [
      "Increase the supply of useful lighter hydrocarbons",
      "Produce only solid minerals",
      "Remove all hydrogen",
      "Convert crude oil into water"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Catalytic cracking converts heavier hydrocarbons into lighter, more useful products."
  },
  {
    "id": "q157",
    "text": "Which substance is associated with the production of ammonia?",
    "options": [
      "Nitrogen",
      "Silica sand",
      "Gypsum",
      "Sodium chloride only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Nitrogen is one of the main reactants used in the Haber process for ammonia production."
  },
  {
    "id": "q158",
    "text": "Which gas reacts with nitrogen in the Haber process?",
    "options": [
      "Hydrogen",
      "Oxygen",
      "Chlorine",
      "Carbon dioxide"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydrogen reacts with nitrogen to form ammonia in the Haber process."
  },
  {
    "id": "q159",
    "text": "Which product of ammonia manufacture is important for fertilizer production?",
    "options": [
      "Ammonia",
      "Bitumen",
      "Silica",
      "PVC"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Ammonia is an important feedstock for manufacturing many nitrogen-containing fertilizers."
  },
  {
    "id": "q160",
    "text": "Which industrial acid is particularly important in fertilizer manufacture?",
    "options": [
      "Sulfuric acid",
      "Acetic acid only",
      "Carbonic acid only",
      "Hydrocyanic acid"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Sulfuric acid is extensively used in fertilizer manufacture."
  },
  {
    "id": "q161",
    "text": "Which process is associated with sodium carbonate production?",
    "options": [
      "Solvay process",
      "Haber process",
      "Ostwald process",
      "Contact process"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The Solvay process is used to manufacture sodium carbonate."
  },
  {
    "id": "q162",
    "text": "Which industrial process is associated with nitric acid?",
    "options": [
      "Ostwald process",
      "Solvay process",
      "Contact process",
      "Haber process"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The Ostwald process is used for nitric acid manufacture."
  },
  {
    "id": "q163",
    "text": "Which industrial process is associated with sulfuric acid?",
    "options": [
      "Contact process",
      "Haber process",
      "Ostwald process",
      "Solvay process"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The Contact process is used to manufacture sulfuric acid."
  },
  {
    "id": "q164",
    "text": "Which industrial process is associated with ammonia?",
    "options": [
      "Haber process",
      "Solvay process",
      "Contact process",
      "Ostwald process"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The Haber process is associated with industrial ammonia production."
  },
  {
    "id": "q165",
    "text": "Which process uses a catalyst to increase reaction rate without being permanently consumed?",
    "options": [
      "Catalytic process",
      "Filtration",
      "Drying",
      "Crystallization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Catalytic processes use catalysts that participate in reaction pathways but are regenerated rather than permanently consumed."
  },
  {
    "id": "q166",
    "text": "What happens to activation energy when a suitable catalyst is introduced?",
    "options": [
      "It is lowered for the catalyzed pathway",
      "It always becomes infinite",
      "It disappears from all reactions",
      "It becomes unrelated to reaction rate"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A catalyst provides an alternative pathway with a lower activation energy."
  },
  {
    "id": "q167",
    "text": "Which raw material is associated with cement manufacture?",
    "options": [
      "Limestone",
      "Latex",
      "Palm oil only",
      "Urea"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Limestone is an important raw material used in cement manufacture."
  },
  {
    "id": "q168",
    "text": "What happens to cement raw materials during clinker formation?",
    "options": [
      "They undergo high-temperature processing",
      "They are frozen",
      "They are filtered through paper",
      "They are hydrogenated"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Cement raw materials are heated to high temperatures to form clinker."
  },
  {
    "id": "q169",
    "text": "Which industrial material is produced by melting silica-containing raw materials?",
    "options": [
      "Glass",
      "Urea",
      "Rubber",
      "Ammonia"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Glass is produced by melting a prepared mixture containing silica and other suitable raw materials."
  },
  {
    "id": "q170",
    "text": "Which property of glass makes it useful in construction?",
    "options": [
      "Its transparency and useful physical properties",
      "Its ability to act as fertilizer",
      "Its ability to rust",
      "Its ability to produce ammonia"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Glass has physical properties such as transparency that make it useful in construction and other applications."
  },
  {
    "id": "q171",
    "text": "What is the primary role of a raw-material preparation stage?",
    "options": [
      "Prepare materials in a suitable form and composition for processing",
      "Destroy all raw materials",
      "Eliminate quality control",
      "Convert every material into gas"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Raw-material preparation ensures materials have the appropriate form, composition and proportions for the process."
  },
  {
    "id": "q172",
    "text": "Why is mixing important in industrial production?",
    "options": [
      "It promotes uniform distribution of components",
      "It always increases waste",
      "It prevents reactions",
      "It eliminates raw materials"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Proper mixing helps distribute components uniformly and can improve process consistency."
  },
  {
    "id": "q173",
    "text": "Which operation is associated with removal of moisture?",
    "options": [
      "Drying",
      "Nitration",
      "Hydrogenation",
      "Oxidation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Drying is the industrial operation used to remove moisture from materials."
  },
  {
    "id": "q174",
    "text": "Which operation is associated with separation of an insoluble solid from a liquid?",
    "options": [
      "Filtration",
      "Distillation",
      "Hydrogenation",
      "Nitration"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Filtration separates insoluble solid particles from a liquid."
  },
  {
    "id": "q175",
    "text": "Which operation is associated with separation based on volatility?",
    "options": [
      "Distillation",
      "Filtration",
      "Drying",
      "Grinding"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Distillation relies on differences in volatility and boiling points."
  },
  {
    "id": "q176",
    "text": "Which operation is associated with formation of crystals from a concentrated solution?",
    "options": [
      "Crystallization",
      "Oxidation",
      "Reduction",
      "Hydrogenation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Crystallization produces solid crystals from a suitably concentrated solution."
  },
  {
    "id": "q177",
    "text": "Which term describes a chemical substance used to start an industrial process?",
    "options": [
      "Raw material",
      "Finished product",
      "Waste",
      "By-product only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A raw material is a starting substance used in industrial production."
  },
  {
    "id": "q178",
    "text": "Which is an example of an industrially important natural mineral?",
    "options": [
      "Limestone",
      "Polyethylene",
      "Synthetic rubber",
      "PVC"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Limestone is a naturally occurring mineral resource used in industries such as cement manufacture."
  },
  {
    "id": "q179",
    "text": "Which material is classified as an agricultural resource?",
    "options": [
      "Sugarcane",
      "Iron ore",
      "Clay",
      "Gypsum"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Sugarcane is an agricultural resource that can serve as an industrial raw material."
  },
  {
    "id": "q180",
    "text": "Which material is classified as a forest resource?",
    "options": [
      "Wood",
      "Phosphate rock",
      "Limestone",
      "Palm oil"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Wood is obtained from forests and is classified as a forest resource."
  },
  {
    "id": "q181",
    "text": "Which of the following is a petrochemical feedstock source?",
    "options": [
      "Petroleum",
      "Limestone",
      "Wood only",
      "Clay only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Petroleum is a major source of petrochemical feedstocks."
  },
  {
    "id": "q182",
    "text": "Natural gas is important to the petrochemical industry because it:",
    "options": [
      "Provides chemical feedstocks",
      "Is a mineral ore",
      "Is used to produce wood",
      "Is a type of glass"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Natural gas provides important hydrocarbons that can be processed into petrochemicals."
  },
  {
    "id": "q183",
    "text": "Which of the following is an example of a downstream petrochemical product?",
    "options": [
      "Plastics",
      "Iron ore",
      "Limestone",
      "Wood"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Plastics are downstream products made from petrochemical feedstocks."
  },
  {
    "id": "q184",
    "text": "What is one purpose of quality assurance documentation?",
    "options": [
      "Provide evidence that procedures and requirements are being followed",
      "Increase defects",
      "Eliminate specifications",
      "Prevent all testing"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Quality assurance relies on planned procedures and documentation to demonstrate that quality requirements are addressed."
  },
  {
    "id": "q185",
    "text": "Why is consistent quality important in industrial production?",
    "options": [
      "It ensures products perform according to requirements",
      "It increases uncertainty",
      "It makes testing unnecessary",
      "It increases product defects"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Consistent quality helps ensure that products meet their intended specifications and performance requirements."
  },
  {
    "id": "q186",
    "text": "Which practice is most appropriate for maintaining industrial product quality?",
    "options": [
      "Regular testing and monitoring",
      "Ignoring process variables",
      "Random mixing",
      "Avoiding specifications"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Regular testing and monitoring help identify deviations and maintain product quality."
  },
  {
    "id": "q187",
    "text": "Which type of fertilizer provides nitrogen to crops?",
    "options": [
      "Nitrogenous fertilizer",
      "Silica fertilizer",
      "Metallic fertilizer",
      "Glass fertilizer"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Nitrogenous fertilizers provide nitrogen, an essential plant nutrient."
  },
  {
    "id": "q188",
    "text": "Which compound is used to manufacture urea?",
    "options": [
      "Ammonia",
      "Silica",
      "Calcium carbonate only",
      "Zinc"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Ammonia is one of the major reactants used in industrial urea production."
  },
  {
    "id": "q189",
    "text": "Which other reactant is required for industrial urea manufacture?",
    "options": [
      "Carbon dioxide",
      "Chlorine",
      "Oxygen only",
      "Sulfur dioxide only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Industrial urea production uses ammonia and carbon dioxide as reactants."
  },
  {
    "id": "q190",
    "text": "Which environmental concern can result from excessive fertilizer use?",
    "options": [
      "Nutrient losses to the environment",
      "Complete elimination of rainfall",
      "Production of iron ore",
      "Formation of glass"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Excess fertilizer nutrients can be lost to surrounding water and soil systems, creating environmental concerns."
  },
  {
    "id": "q191",
    "text": "Which industrial sector commonly uses quality control laboratories?",
    "options": [
      "Chemical manufacturing",
      "Only sports organizations",
      "Only schools",
      "Only transportation companies"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Chemical manufacturing relies heavily on testing and analysis to maintain product and process quality."
  },
  {
    "id": "q192",
    "text": "What does product development involve?",
    "options": [
      "Designing and improving products to meet requirements",
      "Destroying finished products",
      "Eliminating raw materials",
      "Avoiding quality standards"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Product development involves designing, testing and improving products to satisfy defined needs and specifications."
  },
  {
    "id": "q193",
    "text": "What does process development focus on?",
    "options": [
      "Developing efficient methods for manufacturing products",
      "Choosing factory colours",
      "Reducing all chemical reactions",
      "Eliminating process equipment"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Process development focuses on establishing efficient and suitable methods for manufacturing products."
  },
  {
    "id": "q194",
    "text": "Which term describes production carried out without interruption between feed and product streams?",
    "options": [
      "Continuous process",
      "Batch process",
      "Manual process",
      "Static process"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A continuous process involves ongoing feed and product streams rather than separate production lots."
  },
  {
    "id": "q195",
    "text": "Which production method is suitable when a defined quantity is processed at a time?",
    "options": [
      "Batch processing",
      "Continuous processing",
      "Open-flow processing",
      "Cyclone processing"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Batch processing handles a defined quantity of material during each production cycle."
  },
  {
    "id": "q196",
    "text": "What is a major function of a heat exchanger in an industrial plant?",
    "options": [
      "Control or transfer thermal energy between streams",
      "Measure pH",
      "Separate solids from liquids",
      "Produce polymers directly"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Heat exchangers transfer thermal energy between process streams and are important for temperature control and energy recovery."
  },
  {
    "id": "q197",
    "text": "Which separation device uses centrifugal effects to remove particulate matter?",
    "options": [
      "Cyclone separator",
      "Heat exchanger",
      "CSTR",
      "pH meter"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Cyclone separators use centrifugal effects to separate particles from gas streams."
  },
  {
    "id": "q198",
    "text": "Which environmental document assesses possible impacts of a proposed major project?",
    "options": [
      "Environmental Impact Assessment",
      "Product specification",
      "Batch record",
      "Polymer formula"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "An Environmental Impact Assessment evaluates potential environmental effects of proposed projects."
  },
  {
    "id": "q199",
    "text": "Which gas is commonly associated with industrial greenhouse emissions?",
    "options": [
      "Carbon dioxide",
      "Helium",
      "Argon",
      "Neon"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Carbon dioxide is a major greenhouse gas associated with many industrial processes and energy use."
  },
  {
    "id": "q200",
    "text": "Which law is associated with heat conduction?",
    "options": [
      "Fourier’s law",
      "Boyle’s law",
      "Charles’s law",
      "Graham’s law"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Fourier’s law describes heat conduction through a material."
  },
  {
    "id": "q201",
    "text": "Which law is associated with gas pressure and volume at constant temperature?",
    "options": [
      "Boyle’s law",
      "Fourier’s law",
      "Graham’s law",
      "Faraday’s law"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Boyle’s law relates the pressure and volume of a gas at constant temperature."
  },
  {
    "id": "q202",
    "text": "Which type of reactor is commonly operated continuously with mixing throughout the vessel?",
    "options": [
      "CSTR",
      "Batch reactor",
      "Cyclone",
      "Heat exchanger"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A CSTR operates continuously and is designed to keep its contents well mixed."
  },
  {
    "id": "q203",
    "text": "Which reactor differs from a CSTR because it processes a measured charge at a time?",
    "options": [
      "Batch reactor",
      "Continuous stirred tank reactor",
      "Cyclone separator",
      "Heat exchanger"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A batch reactor processes a defined charge of material rather than continuously feeding and removing material."
  },
  {
    "id": "q204",
    "text": "Why is safety important in industrial chemistry?",
    "options": [
      "Industrial chemicals and processes can present hazards",
      "Safety has no relationship to chemical production",
      "It increases uncontrolled reactions",
      "It eliminates the need for training"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Chemical processes can involve hazardous substances and operating conditions, making safety essential."
  },
  {
    "id": "q205",
    "text": "Which factor can affect the efficiency of an industrial reaction?",
    "options": [
      "Temperature and process conditions",
      "Factory paint colour",
      "Office furniture",
      "Company logo"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Reaction performance can depend strongly on conditions such as temperature, pressure, concentration and catalysts."
  },
  {
    "id": "q206",
    "text": "What is one reason catalysts are valuable in industry?",
    "options": [
      "They can increase reaction rates under suitable conditions",
      "They always become the final product",
      "They eliminate raw materials",
      "They prevent chemical reactions"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Catalysts can increase reaction rates by providing a lower-energy reaction pathway."
  },
  {
    "id": "q207",
    "text": "What happens to a catalyst during a catalytic cycle?",
    "options": [
      "It is regenerated",
      "It is always permanently destroyed",
      "It becomes the main product",
      "It evaporates immediately"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A catalyst participates in reaction steps but is regenerated during the overall catalytic cycle."
  },
  {
    "id": "q208",
    "text": "Which industrial product is made using polymer chemistry?",
    "options": [
      "Plastics",
      "Iron ore",
      "Limestone",
      "Crude oil"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Polymer chemistry is central to the manufacture of plastics and other polymeric materials."
  },
  {
    "id": "q209",
    "text": "Which material is an example of a thermosetting polymer?",
    "options": [
      "Bakelite",
      "Polyethylene",
      "Latex",
      "Crude oil"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Bakelite is a classic example of a thermosetting polymer."
  },
  {
    "id": "q210",
    "text": "Which material is the natural source of rubber?",
    "options": [
      "Latex",
      "PVC",
      "Polyethylene",
      "Bitumen"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Natural rubber is obtained from latex."
  },
  {
    "id": "q211",
    "text": "Which treatment improves the strength and durability of natural rubber?",
    "options": [
      "Vulcanization",
      "Distillation",
      "Filtration",
      "Crystallization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Vulcanization improves the useful properties of rubber through sulfur-based crosslinking."
  },
  {
    "id": "q212",
    "text": "Which raw material is most closely associated with the petroleum industry?",
    "options": [
      "Crude oil",
      "Silica sand",
      "Wood",
      "Sugarcane"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Crude oil is the principal raw material processed in petroleum refining."
  },
  {
    "id": "q213",
    "text": "What is the purpose of fractional distillation of crude oil?",
    "options": [
      "Separate crude oil into useful fractions",
      "Convert all hydrocarbons into polymers",
      "Remove all carbon",
      "Produce only one compound"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Fractional distillation separates crude oil into fractions with different boiling ranges and uses."
  },
  {
    "id": "q214",
    "text": "Which process can increase the usefulness of heavy petroleum fractions?",
    "options": [
      "Catalytic cracking",
      "Filtration",
      "Drying",
      "Crystallization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Catalytic cracking converts heavier hydrocarbons into lighter and often more valuable products."
  },
  {
    "id": "q215",
    "text": "Which process is most directly associated with corrosion prevention by zinc coating?",
    "options": [
      "Galvanization",
      "Vulcanization",
      "Hydrogenation",
      "Nitration"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Galvanization protects iron and steel by applying a zinc coating."
  },
  {
    "id": "q216",
    "text": "Which process is most directly associated with converting vegetable oil through addition of hydrogen?",
    "options": [
      "Hydrogenation",
      "Nitration",
      "Oxidation",
      "Distillation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydrogenation adds hydrogen to unsaturated bonds in vegetable oils."
  },
  {
    "id": "q217",
    "text": "Which process is most directly associated with introducing a nitro group?",
    "options": [
      "Nitration",
      "Reduction",
      "Drying",
      "Crystallization"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Nitration introduces a nitro group into a chemical compound."
  },
  {
    "id": "q218",
    "text": "Which industrial operation is used to remove moisture from a solid material?",
    "options": [
      "Drying",
      "Distillation",
      "Nitration",
      "Hydrogenation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Drying removes moisture from solid or other materials."
  },
  {
    "id": "q219",
    "text": "Which industrial operation can separate a dissolved solid from a solution by forming crystals?",
    "options": [
      "Crystallization",
      "Oxidation",
      "Reduction",
      "Hydrogenation"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Crystallization allows dissolved substances to form solid crystals that can be recovered."
  },
  {
    "id": "q220",
    "text": "Which process can remove suspended particles from industrial water?",
    "options": [
      "Filtration",
      "Polymerization",
      "Hydrogenation",
      "Nitration"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Filtration is commonly used to remove suspended particles from water."
  },
  {
    "id": "q221",
    "text": "Which industrial operation can separate a mixture of volatile liquids?",
    "options": [
      "Distillation",
      "Drying",
      "Filtration",
      "Grinding"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Distillation separates volatile components based on differences in boiling points."
  },
  {
    "id": "q222",
    "text": "Which type of process involves a chemical reaction rather than merely physical separation?",
    "options": [
      "Unit process",
      "Unit operation",
      "Packaging process",
      "Storage process"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Unit processes involve chemical transformations, whereas unit operations are primarily physical steps."
  },
  {
    "id": "q223",
    "text": "Which type of process includes filtration and distillation?",
    "options": [
      "Unit operation",
      "Unit process",
      "Chemical synthesis only",
      "Biological reaction"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Filtration and distillation are physical operations classified as unit operations."
  },
  {
    "id": "q224",
    "text": "What is the main purpose of environmental management in chemical industries?",
    "options": [
      "Reduce harmful environmental impacts",
      "Increase pollution",
      "Eliminate waste treatment",
      "Avoid monitoring"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Environmental management aims to reduce pollution and other harmful impacts associated with industrial activities."
  },
  {
    "id": "q225",
    "text": "Which practice can help reduce industrial environmental pollution?",
    "options": [
      "Proper waste and emission control",
      "Deliberate waste dumping",
      "Ignoring emissions",
      "Increasing uncontrolled discharge"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Proper control and treatment of wastes and emissions help reduce environmental pollution."
  },
  {
    "id": "q226",
    "text": "Why is monitoring important in industrial process control?",
    "options": [
      "It allows deviations from desired conditions to be detected",
      "It eliminates all equipment",
      "It prevents measurements",
      "It increases process uncertainty"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Monitoring provides information about process variables and helps operators or control systems detect deviations."
  },
  {
    "id": "q227",
    "text": "Which variable can be monitored in an industrial chemical process?",
    "options": [
      "Temperature",
      "Factory logo",
      "Office colour",
      "Employee shoe size"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Temperature is a key process variable that can affect reaction rates, product quality and safety."
  },
  {
    "id": "q228",
    "text": "Which variable is commonly important in chemical reactor operation?",
    "options": [
      "Pressure",
      "Building colour",
      "Office size",
      "Packaging design only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Pressure is an important operating variable in many industrial chemical reactors."
  },
  {
    "id": "q229",
    "text": "Which term describes a product that meets established requirements?",
    "options": [
      "Conforming product",
      "Waste product",
      "Raw material",
      "Unprocessed feed"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A conforming product meets the defined requirements or specifications."
  },
  {
    "id": "q230",
    "text": "Why are product specifications important in chemical manufacturing?",
    "options": [
      "They define measurable requirements for product quality",
      "They eliminate quality control",
      "They encourage inconsistent production",
      "They prevent testing"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Specifications establish measurable criteria against which product quality can be assessed."
  },
  {
    "id": "q231",
    "text": "Which of the following is most directly related to product safety?",
    "options": [
      "Quality control and regulatory compliance",
      "Ignoring specifications",
      "Avoiding testing",
      "Increasing contamination"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Quality control and regulatory compliance help ensure that products meet required safety and quality standards."
  },
  {
    "id": "q232",
    "text": "Which organization in the supplied material is responsible for regulating relevant products in Nigeria?",
    "options": [
      "NAFDAC",
      "FIFA",
      "WHO only",
      "UNESCO"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "The supplied material identifies NAFDAC as a regulatory organization for relevant regulated products in Nigeria."
  },
  {
    "id": "q233",
    "text": "Which industrial product is strongly associated with the chlor-alkali industry?",
    "options": [
      "Sodium hydroxide",
      "Sulfuric acid only",
      "Urea only",
      "Cement clinker"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Sodium hydroxide is one of the major products of the chlor-alkali process."
  },
  {
    "id": "q234",
    "text": "Which gas is also produced during the chlor-alkali process?",
    "options": [
      "Hydrogen",
      "Helium",
      "Argon",
      "Carbon monoxide"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Hydrogen is produced at the cathode during electrolysis of brine."
  },
  {
    "id": "q235",
    "text": "Which gas is produced at the anode during brine electrolysis?",
    "options": [
      "Chlorine",
      "Hydrogen",
      "Oxygen only",
      "Nitrogen"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Chloride ions are oxidized at the anode, producing chlorine gas."
  },
  {
    "id": "q236",
    "text": "Which ions are mainly responsible for hardness in water?",
    "options": [
      "Ca²⁺ and Mg²⁺",
      "Na⁺ and K⁺",
      "H⁺ and Cl⁻",
      "NO₃⁻ and SO₄²⁻ only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Calcium and magnesium ions are the principal ions responsible for water hardness."
  },
  {
    "id": "q237",
    "text": "Which treatment is associated with removal of temporary hardness?",
    "options": [
      "Boiling",
      "Vulcanization",
      "Hydrogenation",
      "Nitration"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Boiling can remove temporary hardness associated with bicarbonates of calcium and magnesium."
  },
  {
    "id": "q238",
    "text": "Which material is protected by galvanization?",
    "options": [
      "Iron or steel",
      "Glass only",
      "Rubber only",
      "Wood only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Galvanization is used mainly to protect iron and steel from corrosion."
  },
  {
    "id": "q239",
    "text": "Which element gives stainless steel much of its corrosion resistance?",
    "options": [
      "Chromium",
      "Sodium",
      "Sulfur",
      "Nitrogen only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Chromium is a key alloying element responsible for stainless steel’s corrosion resistance."
  },
  {
    "id": "q240",
    "text": "Which device transfers heat between process fluids?",
    "options": [
      "Heat exchanger",
      "pH meter",
      "Cyclone separator",
      "Filter press only"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Heat exchangers transfer heat between process streams."
  },
  {
    "id": "q241",
    "text": "Which device separates particles from a gas using centrifugal effects?",
    "options": [
      "Cyclone separator",
      "Heat exchanger",
      "CSTR",
      "pH meter"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Cyclone separators use centrifugal effects to remove particles from gas streams."
  },
  {
    "id": "q242",
    "text": "Which environmental assessment should normally precede a major industrial project?",
    "options": [
      "Environmental Impact Assessment",
      "Polymerization assessment",
      "Distillation assessment",
      "Batch assessment"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "An Environmental Impact Assessment is used to evaluate potential environmental impacts before major projects proceed."
  },
  {
    "id": "q243",
    "text": "Which greenhouse gas is commonly associated with combustion of fossil fuels?",
    "options": [
      "Carbon dioxide",
      "Helium",
      "Argon",
      "Neon"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Combustion of fossil fuels commonly releases carbon dioxide."
  },
  {
    "id": "q244",
    "text": "Which law can be used to describe heat conduction through a material?",
    "options": [
      "Fourier’s law",
      "Boyle’s law",
      "Charles’s law",
      "Graham’s law"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Fourier’s law relates heat flux to the temperature gradient in conductive heat transfer."
  },
  {
    "id": "q245",
    "text": "What does CSTR stand for?",
    "options": [
      "Continuous Stirred Tank Reactor",
      "Chemical Separation Treatment Reactor",
      "Continuous Solid Transfer Reactor",
      "Controlled Steam Tank Reducer"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "CSTR stands for Continuous Stirred Tank Reactor."
  },
  {
    "id": "q246",
    "text": "Which feature distinguishes a CSTR from a simple storage tank?",
    "options": [
      "It is designed for continuous mixing and reaction",
      "It only stores finished products",
      "It contains no feed",
      "It is used only for filtration"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "A CSTR is specifically designed to provide continuous mixing and chemical reaction."
  },
  {
    "id": "q247",
    "text": "Which of the following is a major goal of industrial chemistry?",
    "options": [
      "Efficient large-scale manufacture of useful products",
      "Elimination of all chemical reactions",
      "Production of laboratory samples only",
      "Avoidance of quality standards"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Industrial chemistry aims to apply chemical knowledge to efficient, safe and economical large-scale production."
  },
  {
    "id": "q248",
    "text": "Which combination best represents important industrial chemistry concerns?",
    "options": [
      "Safety, cost, quality and efficiency",
      "Colour, decoration and advertising",
      "Office size and furniture",
      "Employee clothing and logos"
    ],
    "correct": 0,
    "points": 5,
    "feedback": "Industrial chemistry considers safety, economic performance, quality and process efficiency."
  }
];
