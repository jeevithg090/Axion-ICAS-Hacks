export const programs = [
  { id: "cse", name: "B.E. Computer Science & Engineering", level: "Undergraduate", duration: "4 years (2+2 Pathway)", summary: "Core CS, AI/ML, systems and product engineering with 2 years at MAHE (Manipal) + 2 years at partner university abroad." },
  { id: "aero", name: "B.E. Aeronautical Engineering", level: "Undergraduate", duration: "4 years (2+2 Pathway)", summary: "Aerodynamics, propulsion, structures, avionics; project-based labs and international exposure in years 3–4." },
  { id: "mechatronics", name: "B.E. Mechatronics", level: "Undergraduate", duration: "4 years (2+2 Pathway)", summary: "Robotics, embedded systems, control, and manufacturing with industry‑aligned capstones." }
];

export const courses = [
  { code: "ICS101", title: "Foundations of Applied Science", credits: 4 },
  { code: "BIO422", title: "Wearable Diagnostics", credits: 3 },
  { code: "CSE345", title: "Machine Learning for Medicine", credits: 3 },
  { code: "MAT532", title: "Advanced Materials Characterization", credits: 4 }
];

export const labs = [
  { name: "Software Systems Lab", pi: "Prof. A. Nair", focus: "Scalable backends, cloud, DevOps" },
  { name: "Aero Structures Lab", pi: "Dr. R. Shetty", focus: "Composites, CFD, flight testing" },
  { name: "Robotics & Control Lab", pi: "Dr. P. Verma", focus: "Autonomous robots, mechatronic systems" }
];

export const caseStudies = [
  { title: "Rapid Malaria Detection Strip", area: "Diagnostics", metrics: [{ label: "Sensitivity", value: "94%" }, { label: "Cost/kit", value: "$1.20" }], summary: "Paper‑based test with smartphone readout used in 5 countries." },
  { title: "Wearable ECG Patch", area: "Cardiology", metrics: [{ label: "Patients", value: "1,200" }, { label: "Hospitals", value: "8" }], summary: "Continuous monitoring reduced ER readmissions by 18%." }
];

export const events = [
  { date: "2025-11-18", title: "CSE Hack Day (Enigma Dev)", status: "current", location: "Innovation Hub" },
  { date: "2025-12-02", title: "Aeronautics CFD Workshop", status: "upcoming", location: "Aero Lab" },
  { date: "2025-12-12", title: "Robotics Challenge (Enigma)", status: "upcoming", location: "Makerspace" }
];

export const news = [
  { title: "ICAS (MAHE) launches 2+2 international pathways", summary: "Students can complete 2 years at Manipal and 2 years abroad.", clip: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" },
  { title: "Enigma wins National Robotics Meet", summary: "Robotics domain builds autonomous line‑follower bot.", clip: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" }
];

export const faculty = [
  { name: "Dr. Anita Iyer", title: "Professor", department: "Biomedical Engineering", qualifications: ["Ph.D., MIT", "Fellow, IEEE"], email: "anita.iyer@icas.edu" },
  { name: "Prof. Nikhil Sharma", title: "Associate Professor", department: "Computer Science", qualifications: ["Ph.D., ETH Zürich", "Ex‑Google Research"], email: "nikhil.sharma@icas.edu" },
  { name: "Dr. Mei Lin", title: "Assistant Professor", department: "Materials Science", qualifications: ["Ph.D., NUS"], email: "mei.lin@icas.edu" }
];

export const scholarships = [
  { name: "Merit Scholarship", amount: "Up to 100% tuition", criteria: "Top 5% applicants, leadership" },
  { name: "Need‑Based Grant", amount: "$2,000 – $12,000", criteria: "FAFSA/means assessment" },
  { name: "Research Assistantship", amount: "$1,200/mo stipend", criteria: "Graduate research placements" }
];

export const medicalAid = [
  { service: "On‑campus Clinic", hours: "Mon–Fri 8am–8pm", notes: "Walk‑ins welcome; urgent care available" },
  { service: "Insurance Desk", hours: "Mon–Fri 10am–5pm", notes: "Cashless tie‑ups with 40+ providers" },
  { service: "Mental Health Counseling", hours: "By appointment", notes: "Confidential sessions, tele‑health" }
];

export const outreach = [
  { title: "Village Tech Labs", region: "Udupi, Karnataka", impact: "18 labs installed", partners: ["Local Schools", "CSR"] },
  { title: "MAHE Community Makers", region: "Coastal Karnataka", impact: "800+ student volunteers", partners: ["MAHE", "NGOs"] }
];

export const contacts = {
  address: "ICAS (MAHE), Manipal, Karnataka, India",
  email: "hello@icas.edu",
  phone: "+91 80 1234 5678",
  map: "https://www.google.com/maps"
};

export const twoPlusTwoPartners = [
  { name: "University of X", country: "USA" },
  { name: "Tech University Y", country: "Germany" },
  { name: "Institute Z", country: "Australia" }
];

export const enigma = {
  name: "Enigma",
  description:
    "ICAS student club fostering innovation through Development, Robotics, and Research domains.",
  domains: [
    { name: "Development", blurb: "Web, mobile, cloud; ship products and hackathons.", image: "https://images.pexels.com/photos/8636609/pexels-photo-8636609.jpeg" },
    { name: "Robotics", blurb: "Mechanisms, electronics, control, competitions.", image: "https://images.pexels.com/photos/31121842/pexels-photo-31121842.jpeg" },
    { name: "Research", blurb: "Papers, literature reviews, reproducible science.", image: "https://images.pexels.com/photos/8471835/pexels-photo-8471835.jpeg" }
  ],
};

export const timetableMeta = {
  semester: "III Sem",
  program: "CSE",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export type TimetableSlot = {
  day: (typeof timetableMeta.days)[number];
  start: string; // "HH:MM" 24h
  end: string; // "HH:MM" 24h
  course: string;
  code: string;
  room?: string;
  color: "violet" | "pink" | "emerald" | "cyan" | "orange" | "blue" | "indigo";
};

export const timetableSlots: TimetableSlot[] = [
  { day: "Mon", start: "09:00", end: "10:00", course: "MATH S-III", code: "ICS 231", color: "violet" },
  { day: "Mon", start: "11:00", end: "12:00", course: "ML", code: "ICS 235", color: "emerald" },

  { day: "Tue", start: "08:00", end: "09:00", course: "SDOOP", code: "ICS 233", color: "pink" },
  { day: "Tue", start: "13:00", end: "14:00", course: "SDOOP", code: "ICS 233", color: "pink" },
  { day: "Tue", start: "15:30", end: "17:30", course: "P LAB", code: "ICS 239", color: "indigo" },

  { day: "Wed", start: "08:00", end: "09:00", course: "ML", code: "ICS 235", color: "emerald" },
  { day: "Wed", start: "10:30", end: "11:30", course: "DAP", code: "ICS 237", color: "orange" },
  { day: "Wed", start: "11:30", end: "12:30", course: "DMS", code: "ICS 231", color: "blue" },

  { day: "Thu", start: "09:00", end: "10:00", course: "DAP", code: "ICS 237", color: "orange" },
  { day: "Thu", start: "11:30", end: "12:30", course: "DMS", code: "ICS 231", color: "blue" },
  { day: "Thu", start: "13:30", end: "14:30", course: "MATH", code: "IMA 231", color: "violet" },
  { day: "Thu", start: "15:30", end: "16:30", course: "SDOOP", code: "ICS 233", color: "pink" },

  { day: "Fri", start: "09:00", end: "10:00", course: "ML", code: "ICS 235", color: "emerald" },
  { day: "Fri", start: "12:30", end: "13:30", course: "DMS", code: "ICS 231", color: "blue" },
  { day: "Fri", start: "14:30", end: "15:30", course: "MATH", code: "IMA 231", color: "violet" },
  { day: "Fri", start: "15:30", end: "16:30", course: "SDOOP", code: "ICS 233", color: "pink" },

  { day: "Sat", start: "09:00", end: "12:00", course: "DMS LAB + MINI PROJECT", code: "ICS 241", color: "blue" },
];

export const transferUniversities: Record<string, { name: string; url: string }[]> = {
  "United States of America": [
    { name: "Milwaukee School of Engineering, 1025 North Broadway, Milwaukee, WI", url: "https://www.msoe.edu" },
    { name: "Andrews University, Berrien Springs, Michigan", url: "https://www.andrews.edu" },
    { name: "North Dakota State University, Fargo, North Dakota", url: "https://www.ndsu.edu" },
    { name: "The State University of New York, Buffalo, NY", url: "https://www.buffalo.edu" },
    { name: "The University of Missouri, Columbia", url: "https://missouri.edu" },
    { name: "Drexel University, Philadelphia", url: "https://drexel.edu" },
    { name: "University of Dayton, Dayton, Ohio", url: "https://www.udayton.edu" },
    { name: "Wright State University, Dayton, Ohio", url: "https://www.wright.edu" },
    { name: "Southern Illinois University Carbondale, Carbondale, IL", url: "https://siu.edu" },
    { name: "University of Wisconsin-Milwaukee, Milwaukee, WI", url: "https://uwm.edu" },
    { name: "Montana State University, Bozeman, Montana", url: "https://www.montana.edu" },
    { name: "University of North Texas, Denton, Texas", url: "https://www.unt.edu" },
    { name: "Illinois Institute of Technology, Chicago", url: "https://www.iit.edu" },
    { name: "University of Illinois, Urbana-Champaign", url: "https://illinois.edu" },
    { name: "St. Cloud State University, St. Cloud", url: "https://www.stcloudstate.edu" },
    { name: "The University of South Alabama, Alabama", url: "https://www.southalabama.edu" },
    { name: "Purdue University, West Lafayette", url: "https://www.purdue.edu" },
    { name: "University of Wisconsin, Langdon Street, Madison, WI", url: "https://www.wisc.edu" },
    { name: "University of Maryland, College Park, MD", url: "https://www.umd.edu" },
    { name: "University of Arizona, Tucson, AZ", url: "https://www.arizona.edu" },
    { name: "Iowa State University, Ames, IOWA", url: "https://www.iastate.edu" },
    { name: "University of Nebraska, Lincoln, NE", url: "https://www.unl.edu" },
    { name: "Virginia Tech, Blacksburg, VA", url: "https://vt.edu" },
    { name: "University of Minnesota- Twin Cities, Minneapolis, MN", url: "https://twin-cities.umn.edu" },
    { name: "Columbia University, Broadway New York", url: "https://www.columbia.edu" },
    { name: "University of Florida, Gainesville, Florida", url: "https://www.ufl.edu" },
    { name: "Vanderbilt University, Nashville", url: "https://www.vanderbilt.edu" },
    { name: "University of Rochester, Rochester, NY", url: "https://www.rochester.edu" },
    { name: "Case Western Reserve University, Cleveland, OH", url: "https://case.edu" },
    { name: "University of California- Berkeley, Berkeley, CA", url: "https://www.berkeley.edu" },
    { name: "University of Massachusetts, Amherst", url: "https://www.umass.edu" },
    { name: "University of Southern California, Los Angeles", url: "https://www.usc.edu" },
    { name: "Texas A & M, College Station, Texas", url: "https://www.tamu.edu" },
    { name: "University of Texas, Dallas", url: "https://www.utdallas.edu" },
    { name: "Ohio State University, Columbus, Ohio", url: "https://www.osu.edu" },
    { name: "Georgia Tech, Atlanta, Georgia", url: "https://www.gatech.edu" },
    { name: "Rutgers State University, New Jersey", url: "https://www.rutgers.edu" },
    { name: "Wichita State University, Kansas", url: "https://www.wichita.edu" },
    { name: "Embry-Riddle Aeronautical University, Florida", url: "https://erau.edu" },
    { name: "Boston University, Boston", url: "https://www.bu.edu" },
    { name: "South Dakota State University, Brookings", url: "https://www.sdstate.edu" },
    { name: "Stony Brook University, Stony Brook, NY", url: "https://www.stonybrook.edu" },
    { name: "Pennsylvania State University, Pennsylvania", url: "https://www.psu.edu" },
    { name: "California State University, Golden Shore, Long Beach, CA", url: "https://www.csulb.edu" },
    { name: "New York University, NY", url: "https://www.nyu.edu" },
    { name: "Arizona State University, Tempe, Arizona", url: "https://www.asu.edu" },
    { name: "Cornell University, Ithaca, NY", url: "https://www.cornell.edu" },
    { name: "Washington State University, Washington", url: "https://wsu.edu" },
    { name: "University of Washington, Seattle, Washington", url: "https://www.washington.edu" },
    { name: "Kettering University, Flint, Michigan", url: "https://www.kettering.edu" },
    { name: "Marquette University, Milwaukee", url: "https://www.marquette.edu" },
    { name: "Brown University, Rhode Island", url: "https://www.brown.edu" },
    { name: "University of Colorado, Colorado", url: "https://www.colorado.edu" },
    { name: "Colorado State University, Colorado", url: "https://www.colostate.edu" },
    { name: "San Jose State University, California", url: "https://www.sjsu.edu" },
    { name: "University of North Florida, Jacksonville", url: "https://www.unf.edu" },
    { name: "San Francisco State University, California", url: "https://www.sfsu.edu" },
    { name: "Kansas State University, USA", url: "https://www.k-state.edu" }
  ],
  Australia: [
    { name: "Deakin University, Melbourne/Geelong, Victoria", url: "https://www.deakin.edu.au" },
    { name: "University of Queensland, Brisbane", url: "https://www.uq.edu.au" },
    { name: "University of New South Wales, Sydney", url: "https://www.unsw.edu.au" },
    { name: "University of Technology, Sydney", url: "https://www.uts.edu.au" },
    { name: "Queensland University of Technology, Brisbane", url: "https://www.qut.edu.au" },
    { name: "Royal Melbourne Institute of Technology, Melbourne", url: "https://www.rmit.edu.au" },
    { name: "Australian National University, Canberra", url: "https://www.anu.edu.au" },
    { name: "University of Sydney, New South Wales", url: "https://www.sydney.edu.au" },
    { name: "University of Wollongong, Wollongong, NSW", url: "https://www.uow.edu.au" },
    { name: "Western Sydney University, Sydney, NSW", url: "https://www.westernsydney.edu.au" },
    { name: "University of Adelaide, Adelaide", url: "https://www.adelaide.edu.au" },
    { name: "Macquarie University, Sydney", url: "https://www.mq.edu.au" },
    { name: "Federation University", url: "https://federation.edu.au" },
    { name: "Monash University, Clayton, Victoria", url: "https://www.monash.edu" },
    { name: "Curtin University, Kent St, Bentley", url: "https://www.curtin.edu.au" }
  ],
  "United Kingdom": [
    { name: "City, University of London, Northampton Square, London", url: "https://www.city.ac.uk" },
    { name: "Lancaster University, Lancaster", url: "https://www.lancaster.ac.uk" },
    { name: "University of Leicester, Leicester", url: "https://le.ac.uk" },
    { name: "University of Nottingham, Nottingham", url: "https://www.nottingham.ac.uk" },
    { name: "University of Birmingham, Birmingham, West Midlands", url: "https://www.birmingham.ac.uk" },
    { name: "Queen Mary University of London, Mile End Road, London", url: "https://www.qmul.ac.uk" },
    { name: "University of Strathclyde, Glasgow, Scotland", url: "https://www.strath.ac.uk" },
    { name: "Heriot-Watt University, Edinburgh", url: "https://www.hw.ac.uk" },
    { name: "University of Edinburgh, Edinburgh", url: "https://www.ed.ac.uk" },
    { name: "University of London, London", url: "https://london.ac.uk" },
    { name: "University of Central Lancashire, Preston", url: "https://www.uclan.ac.uk" },
    { name: "Manchester Metropolitan University", url: "https://www.mmu.ac.uk" }
  ],
  Canada: [
    { name: "Queen's University, Kingston", url: "https://www.queensu.ca" },
    { name: "University of Manitoba, Winnipeg", url: "https://umanitoba.ca" },
    { name: "University of New Brunswick, New Brunswick", url: "https://www.unb.ca" },
    { name: "University of Toronto, Toronto", url: "https://www.utoronto.ca" },
    { name: "Concordia University, Montreal", url: "https://www.concordia.ca" },
    { name: "Carleton University, Ottawa", url: "https://carleton.ca" },
    { name: "University of British Columbia, Vancouver", url: "https://www.ubc.ca" }
  ],
  Ireland: [
    { name: "University College Cork (UCC)", url: "https://www.ucc.ie" },
    { name: "Trinity College Dublin (TCD)", url: "https://www.tcd.ie" }
  ],
  France: [
    { name: "Ecole Supérieure d'Ingénieurs de Rouen (ESIGELEC), Rouen", url: "https://www.esigelec.fr" }
  ],
  Germany: [
    { name: "Leibniz University of Hannover, Hannover", url: "https://www.uni-hannover.de" }
  ],
  Netherlands: [
    { name: "University of Twente", url: "https://www.utwente.nl" },
    { name: "Groningen University", url: "https://www.rug.nl" }
  ],
  Slovenia: [
    { name: "Academia Maribor, Slovenia", url: "https://www.um.si" }
  ],
  Malaysia: [
    { name: "Manipal International University, Negeri Sembilan", url: "https://www.miu.edu.my" }
  ],
  Dubai: [
    { name: "Manipal University, Dubai", url: "https://www.manipaldubai.com" }
  ],
};

export type Alumni = {
  name: string;
  gradYear: number;
  programId: "cse" | "aero" | "mechatronics";
  role: string;
  company: string;
  linkedin?: string;
  location?: string;
};

export const alumni: Alumni[] = [
  { name: "Anika Iyer", gradYear: 2019, programId: "cse", role: "Senior Software Engineer", company: "Google", location: "Bengaluru, IN", linkedin: "https://www.linkedin.com/in/anikaiyer" },
  { name: "Ravi Mehta", gradYear: 2018, programId: "cse", role: "Principal Engineer", company: "Amazon", location: "Hyderabad, IN", linkedin: "https://www.linkedin.com/in/ravimehta" },
  { name: "Priya Nair", gradYear: 2020, programId: "aero", role: "Flight Dynamics Engineer", company: "Airbus", location: "Toulouse, FR", linkedin: "https://www.linkedin.com/in/priyanair" },
  { name: "Arjun Verma", gradYear: 2017, programId: "mechatronics", role: "Robotics Engineer", company: "Boston Dynamics", location: "Boston, US", linkedin: "https://www.linkedin.com/in/arjunverma" },
  { name: "Meera Shah", gradYear: 2019, programId: "cse", role: "Product Manager", company: "Microsoft", location: "Redmond, US", linkedin: "https://www.linkedin.com/in/meerashah" },
  { name: "Karthik Rao", gradYear: 2016, programId: "aero", role: "Avionics Systems Lead", company: "ISRO", location: "Bengaluru, IN", linkedin: "https://www.linkedin.com/in/karthikrao" },
  { name: "Sara Fernandes", gradYear: 2021, programId: "mechatronics", role: "Automation Engineer", company: "Siemens", location: "Munich, DE", linkedin: "https://www.linkedin.com/in/sarafernandes" },
  { name: "Naveen Kulkarni", gradYear: 2018, programId: "cse", role: "Data Scientist", company: "NVIDIA", location: "Santa Clara, US", linkedin: "https://www.linkedin.com/in/naveenkulkarni" },
  { name: "Aisha Khan", gradYear: 2020, programId: "aero", role: "Propulsion Analyst", company: "Rolls‑Royce", location: "Derby, UK", linkedin: "https://www.linkedin.com/in/aishakhan" },
];

export const alumniStories = [
  { name: "Anika Iyer", role: "Senior Software Engineer", company: "Google", quote: "The 2+2 pathway opened doors to global internships and a full‑time offer." },
  { name: "Priya Nair", role: "Flight Dynamics Engineer", company: "Airbus", quote: "Hands‑on aero labs gave me the confidence to ship flight‑ready models." },
  { name: "Arjun Verma", role: "Robotics Engineer", company: "Boston Dynamics", quote: "Capstone in autonomous systems directly translated to my current work." },
];

export const alumniOpportunities = [
  { title: "Mentor a final‑year capstone", org: "ICAS", location: "Remote / On‑campus", link: "/Contact" },
  { title: "Host an industry talk", org: "Enigma", location: "Hybrid", link: "/Enigma" },
  { title: "Refer for internships", org: "Partner Companies", location: "Global", link: "https://www.linkedin.com/school/mahemanipal/" },
  { title: "Sponsor a student project", org: "Innovation Hub", location: "On‑campus", link: "/Contact" },
];

export const portalCourses = [
  { code: "ICS 231", title: "Database Management Systems", instructor: "Dr. Rao", progress: 62 },
  { code: "ICS 235", title: "Machine Learning", instructor: "Prof. Nikhil", progress: 48 },
  { code: "ICS 233", title: "Software Design (OOP)", instructor: "Dr. Anita", progress: 71 },
];

export const portalAssignments = [
  { id: "a1", title: "DBMS Mini Project Proposal", course: "ICS 231", due: new Date().setDate(new Date().getDate() + 2), status: "open" },
  { id: "a2", title: "ML Assignment 2 — Regression", course: "ICS 235", due: new Date().setDate(new Date().getDate() + 5), status: "open" },
  { id: "a3", title: "OOP Lab 4 Submission", course: "ICS 233", due: new Date().setDate(new Date().getDate() - 1), status: "late" },
];

export const portalAnnouncements = [
  { id: "n1", title: "Guest lecture: Data Lakes", course: "ICS 231", date: new Date().toISOString() },
  { id: "n2", title: "Quiz 1 results published", course: "ICS 235", date: new Date().toISOString() },
  { id: "n3", title: "Lab rescheduled to Friday", course: "ICS 233", date: new Date().toISOString() },
];

export const portalGrades = {
  gpa: 8.4,
  courses: [
    { code: "ICS 231", grade: "A" },
    { code: "ICS 235", grade: "B+" },
    { code: "ICS 233", grade: "A-" },
  ],
};

export const portalQuickLinks = [
  { label: "Submit Assignment", href: "/portal#submit", variant: "default" },
  { label: "Ask in Forum", href: "/portal#forum", variant: "outline" },
  { label: "Meet Link", href: "https://meet.google.com/", variant: "secondary", external: true },
];

export const portalUsers = [
  { email: "student@icas.edu", password: "icas123", name: "Student One", role: "student" },
  { email: "prof@icas.edu", password: "icas123", name: "Prof. Rao", role: "professor" },
  { email: "admin@icas.edu", password: "icas123", name: "Admin", role: "admin" },
];

export const portalCourseDetails: Record<string, { syllabus: string; assignments: { id: string; title: string; due: number; maxMarks: number }[] }> = {
  "ICS 231": {
    syllabus: "Relational algebra, SQL, normalization, transactions, indexing, query optimization, design project.",
    assignments: [
      { id: "dbms-a1", title: "Schema Design (ER + 3NF)", due: new Date().setDate(new Date().getDate() + 3), maxMarks: 20 },
      { id: "dbms-a2", title: "SQL Queries Set-1", due: new Date().setDate(new Date().getDate() + 10), maxMarks: 20 },
    ],
  },
  "ICS 235": {
    syllabus: "Supervised learning, regression/classification, model selection, pipelines, evaluation.",
    assignments: [
      { id: "ml-a1", title: "Regression Notebook", due: new Date().setDate(new Date().getDate() + 6), maxMarks: 25 },
    ],
  },
  "ICS 233": {
    syllabus: "OOP principles, design patterns, testing, refactoring, SOLID.",
    assignments: [
      { id: "oop-a1", title: "Refactor Legacy Codebase", due: new Date().setDate(new Date().getDate() + 7), maxMarks: 30 },
    ],
  },
};
