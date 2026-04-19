import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

type SeedOptions = {
  reset?: boolean;
};

export async function seedDemoData(prisma: PrismaClient, options: SeedOptions = {}) {
  if (options.reset) {
    await prisma.$transaction([
      prisma.auditLog.deleteMany(),
      prisma.externalLink.deleteMany(),
      prisma.fileAsset.deleteMany(),
      prisma.mediaMention.deleteMany(),
      prisma.eventActivity.deleteMany(),
      prisma.newsItem.deleteMany(),
      prisma.publicationAuthor.deleteMany(),
      prisma.projectMember.deleteMany(),
      prisma.groupMember.deleteMany(),
      prisma.researcherResearchArea.deleteMany(),
      prisma.thesis.deleteMany(),
      prisma.dataset.deleteMany(),
      prisma.awardPrize.deleteMany(),
      prisma.facilityEquipment.deleteMany(),
      prisma.publication.deleteMany(),
      prisma.project.deleteMany(),
      prisma.researchGroup.deleteMany(),
      prisma.studentProfile.deleteMany(),
      prisma.researcherProfile.deleteMany(),
      prisma.user.deleteMany(),
      prisma.role.deleteMany(),
      prisma.department.deleteMany(),
      prisma.faculty.deleteMany(),
      prisma.researchArea.deleteMany(),
      prisma.keywordTag.deleteMany(),
      prisma.journal.deleteMany(),
      prisma.conference.deleteMany(),
    ]);
  }

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const [
    superAdminRole,
    portalAdminRole,
    oricRole,
    coordinatorRole,
    researcherRole,
    assistantRole,
  ] = await Promise.all([
    prisma.role.create({
      data: { name: 'SUPER_ADMIN', description: 'Full platform access.' },
    }),
    prisma.role.create({
      data: { name: 'PORTAL_ADMIN', description: 'Portal administration access.' },
    }),
    prisma.role.create({
      data: { name: 'ORIC_STAFF', description: 'Research office review staff.' },
    }),
    prisma.role.create({
      data: {
        name: 'DEPARTMENT_COORDINATOR',
        description: 'Department-level review and coordination.',
      },
    }),
    prisma.role.create({
      data: { name: 'RESEARCHER', description: 'Faculty researcher access.' },
    }),
    prisma.role.create({
      data: {
        name: 'STUDENT_RESEARCH_ASSISTANT',
        description: 'Student assistant access.',
      },
    }),
  ]);

  const [facultySci, facultyEng, facultySoc] = await Promise.all([
    prisma.faculty.create({
      data: {
        name: 'Faculty of Science and Technology',
        slug: 'faculty-of-science-and-technology',
        description: 'Computing, applied sciences, and data-driven research.',
      },
    }),
    prisma.faculty.create({
      data: {
        name: 'Faculty of Engineering',
        slug: 'faculty-of-engineering',
        description: 'Engineering systems, smart infrastructure, and embedded innovation.',
      },
    }),
    prisma.faculty.create({
      data: {
        name: 'Faculty of Social Sciences',
        slug: 'faculty-of-social-sciences',
        description: 'Management, policy, and institutional transformation research.',
      },
    }),
  ]);

  const [depCs, depEe, depMs] = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Department of Computer Science',
        slug: 'computer-science',
        description:
          'Research in intelligent systems, software engineering, secure systems, and academic knowledge discovery.',
        facultyId: facultySci.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Department of Electrical Engineering',
        slug: 'electrical-engineering',
        description:
          'Research spanning embedded systems, control, communication engineering, and smart energy systems.',
        facultyId: facultyEng.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Department of Management Sciences',
        slug: 'management-sciences',
        description:
          'Research in digital strategy, innovation management, and public-sector transformation.',
        facultyId: facultySoc.id,
      },
    }),
  ]);

  const [areaAi, areaCyber, areaEnergy, areaHealth] = await Promise.all([
    prisma.researchArea.create({
      data: {
        name: 'Artificial Intelligence',
        slug: 'artificial-intelligence',
        description: 'Machine learning, language technologies, and applied intelligence.',
      },
    }),
    prisma.researchArea.create({
      data: {
        name: 'Cyber Security',
        slug: 'cyber-security',
        description: 'Cyber resilience, digital forensics, secure systems, and privacy.',
      },
    }),
    prisma.researchArea.create({
      data: {
        name: 'Sustainable Energy Systems',
        slug: 'sustainable-energy-systems',
        description: 'Smart grids, power optimization, forecasting, and resilient energy systems.',
      },
    }),
    prisma.researchArea.create({
      data: {
        name: 'Digital Health',
        slug: 'digital-health',
        description: 'Clinical informatics, assistive technologies, and health-data systems.',
      },
    }),
  ]);

  const [tagDiscovery, tagSecurity, tagEnergy] = await Promise.all([
    prisma.keywordTag.create({ data: { name: 'Research Discovery', slug: 'research-discovery' } }),
    prisma.keywordTag.create({ data: { name: 'Incident Response', slug: 'incident-response' } }),
    prisma.keywordTag.create({ data: { name: 'Load Forecasting', slug: 'load-forecasting' } }),
  ]);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Areeba Ahmed',
        email: 'areeba.ahmed@lgu.edu.pk',
        passwordHash,
        roleId: superAdminRole.id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bilal Raza',
        email: 'bilal.raza@lgu.edu.pk',
        passwordHash,
        roleId: oricRole.id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maham Siddiqui',
        email: 'maham.siddiqui@lgu.edu.pk',
        passwordHash,
        roleId: coordinatorRole.id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Sara Khalid',
        email: 'sara.khalid@lgu.edu.pk',
        passwordHash,
        roleId: researcherRole.id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Usman Farooq',
        email: 'usman.farooq@lgu.edu.pk',
        passwordHash,
        roleId: researcherRole.id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Aiman Shah',
        email: 'aiman.shah@lgu.edu.pk',
        passwordHash,
        roleId: researcherRole.id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Mahnoor Tariq',
        email: 'mahnoor.tariq@lgu.edu.pk',
        passwordHash,
        roleId: assistantRole.id,
        status: 'ACTIVE',
      },
    }),
  ]);

  const [userSuperAdmin, userOric, , userSara, userUsman, userAiman, userStudent] = users;

  const [researcherSara, researcherUsman, researcherAiman] = await Promise.all([
    prisma.researcherProfile.create({
      data: {
        userId: userSara.id,
        employeeId: 'LGU-CS-1001',
        firstName: 'Sara',
        lastName: 'Khalid',
        slug: 'dr-sara-khalid',
        designation: 'Associate Professor, AI and Data Systems',
        biography:
          'Dr. Sara Khalid leads interdisciplinary research connecting machine learning, knowledge discovery, and institutional intelligence systems at LGU.',
        qualifications: 'PhD Computer Science',
        expertiseSummary:
          'Multimodal learning, academic discovery systems, and explainable AI for public-sector planning.',
        orcid: '0000-0002-1001-2001',
        googleScholar: 'https://scholar.google.com/citations?user=lgu-sara',
        scopusId: '57200100001',
        departmentId: depCs.id,
        facultyId: facultySci.id,
      },
    }),
    prisma.researcherProfile.create({
      data: {
        userId: userUsman.id,
        employeeId: 'LGU-CS-1002',
        firstName: 'Usman',
        lastName: 'Farooq',
        slug: 'dr-usman-farooq',
        designation: 'Professor, Secure Systems Engineering',
        biography:
          'Dr. Usman Farooq coordinates LGU security research initiatives with a focus on incident response automation and digital forensics.',
        qualifications: 'PhD Information Security',
        expertiseSummary:
          'Secure architectures, cyber defense simulation, digital forensics, and resilient campus systems.',
        orcid: '0000-0002-1002-2002',
        googleScholar: 'https://scholar.google.com/citations?user=lgu-usman',
        scopusId: '57200100002',
        departmentId: depCs.id,
        facultyId: facultySci.id,
      },
    }),
    prisma.researcherProfile.create({
      data: {
        userId: userAiman.id,
        employeeId: 'LGU-EE-1001',
        firstName: 'Aiman',
        lastName: 'Shah',
        slug: 'dr-aiman-shah',
        designation: 'Assistant Professor, Smart Energy Systems',
        biography:
          'Dr. Aiman Shah develops forecasting and optimization systems for campus-scale power infrastructure and urban energy planning.',
        qualifications: 'PhD Electrical Engineering',
        expertiseSummary:
          'Smart-grid forecasting, demand response optimization, and intelligent energy monitoring.',
        orcid: '0000-0002-1003-2003',
        googleScholar: 'https://scholar.google.com/citations?user=lgu-aiman',
        scopusId: '57200100003',
        departmentId: depEe.id,
        facultyId: facultyEng.id,
      },
    }),
  ]);

  await prisma.studentProfile.create({
    data: {
      userId: userStudent.id,
      registrationNo: 'LGU-MS-2025-045',
      firstName: 'Mahnoor',
      lastName: 'Tariq',
      departmentId: depCs.id,
    },
  });

  await prisma.researcherResearchArea.createMany({
    data: [
      { researcherId: researcherSara.id, researchAreaId: areaAi.id },
      { researcherId: researcherSara.id, researchAreaId: areaHealth.id },
      { researcherId: researcherUsman.id, researchAreaId: areaCyber.id },
      { researcherId: researcherUsman.id, researchAreaId: areaAi.id },
      { researcherId: researcherAiman.id, researchAreaId: areaEnergy.id },
    ],
  });

  const [groupDiscovery, groupCyber, groupEnergy] = await Promise.all([
    prisma.researchGroup.create({
      data: {
        name: 'Knowledge Systems and Discovery Lab',
        slug: 'knowledge-systems-and-discovery-lab',
        description:
          'A cross-disciplinary lab for semantic search, research intelligence, and institutional analytics.',
        departmentId: depCs.id,
        facultyId: facultySci.id,
        leadResearcherId: researcherSara.id,
        researchAreas: {
          connect: [{ id: areaAi.id }, { id: areaHealth.id }],
        },
      },
    }),
    prisma.researchGroup.create({
      data: {
        name: 'Cyber Resilience and Forensics Group',
        slug: 'cyber-resilience-and-forensics-group',
        description:
          'Focused on secure architectures, cyber defense simulation, and operational resilience.',
        departmentId: depCs.id,
        facultyId: facultySci.id,
        leadResearcherId: researcherUsman.id,
        researchAreas: { connect: [{ id: areaCyber.id }] },
      },
    }),
    prisma.researchGroup.create({
      data: {
        name: 'Smart Grid Optimization Unit',
        slug: 'smart-grid-optimization-unit',
        description:
          'Researches smart metering, predictive control, renewable integration, and energy-aware campus infrastructure.',
        departmentId: depEe.id,
        facultyId: facultyEng.id,
        leadResearcherId: researcherAiman.id,
        researchAreas: { connect: [{ id: areaEnergy.id }] },
      },
    }),
  ]);

  await prisma.groupMember.createMany({
    data: [
      { groupId: groupDiscovery.id, researcherId: researcherSara.id, role: 'Lead' },
      { groupId: groupDiscovery.id, researcherId: researcherUsman.id, role: 'Collaborator' },
      { groupId: groupCyber.id, researcherId: researcherUsman.id, role: 'Lead' },
      { groupId: groupCyber.id, researcherId: researcherSara.id, role: 'Collaborator' },
      { groupId: groupEnergy.id, researcherId: researcherAiman.id, role: 'Lead' },
    ],
  });

  const journal = await prisma.journal.create({
    data: {
      name: 'Journal of Information Discovery Systems',
      slug: 'journal-of-information-discovery-systems',
      publisher: 'Academic Discovery Press',
    },
  });

  const conference = await prisma.conference.create({
    data: {
      name: 'International Conference on Applied Cyber Defense',
      slug: 'international-conference-on-applied-cyber-defense',
      acronym: 'ICACD',
      organizer: 'Applied Cyber Defense Forum',
    },
  });

  const [projectDiscovery, projectCyber, projectEnergy] = await Promise.all([
    prisma.project.create({
      data: {
        title: 'LGU Research Intelligence and Discovery Platform',
        slug: 'lgu-research-intelligence-and-discovery-platform',
        abstract:
          'A university-wide initiative to unify researcher profiles, outputs, search, and analytics into one discoverable ecosystem.',
        status: 'PUBLISHED',
        lifecycleStatus: 'ACTIVE',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2027-06-30'),
        fundingAgency: 'LGU ORIC',
        budget: '4800000',
        departmentId: depCs.id,
        facultyId: facultySci.id,
        groupId: groupDiscovery.id,
        principalInvestigatorId: researcherSara.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Campus Cyber Range and Incident Readiness Program',
        slug: 'campus-cyber-range-and-incident-readiness-program',
        abstract:
          'Builds a realistic learning and research environment for cyber drills, detection engineering, and response playbooks.',
        status: 'APPROVED',
        lifecycleStatus: 'ACTIVE',
        startDate: new Date('2024-05-15'),
        endDate: new Date('2026-12-20'),
        fundingAgency: 'National Cyber Security Initiative',
        budget: '7200000',
        departmentId: depCs.id,
        facultyId: facultySci.id,
        groupId: groupCyber.id,
        principalInvestigatorId: researcherUsman.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Smart Campus Energy Forecasting and Optimization',
        slug: 'smart-campus-energy-forecasting-and-optimization',
        abstract:
          'Combines energy forecasting, occupancy patterns, and control recommendations to reduce campus operational waste.',
        status: 'PUBLISHED',
        lifecycleStatus: 'COMPLETED',
        startDate: new Date('2023-01-10'),
        endDate: new Date('2025-01-15'),
        fundingAgency: 'Higher Education Innovation Fund',
        budget: '3600000',
        departmentId: depEe.id,
        facultyId: facultyEng.id,
        groupId: groupEnergy.id,
        principalInvestigatorId: researcherAiman.id,
      },
    }),
  ]);

  await prisma.projectMember.createMany({
    data: [
      {
        projectId: projectDiscovery.id,
        researcherId: researcherUsman.id,
        role: 'Co-Investigator',
        isCoPi: true,
      },
      {
        projectId: projectCyber.id,
        researcherId: researcherSara.id,
        role: 'Research Collaborator',
        isCoPi: false,
      },
    ],
  });

  const [publicationDiscovery, publicationCyber, publicationEnergy] = await Promise.all([
    prisma.publication.create({
      data: {
        title:
          'Semantic Ranking for University Research Discovery Using Faculty, Project, and Output Signals',
        slug: 'semantic-ranking-for-university-research-discovery',
        abstract:
          'Introduces a hybrid ranking pipeline for academic portals that blends researcher authority, semantic relevance, and institutional context.',
        publicationType: 'JOURNAL_ARTICLE',
        journalName: journal.name,
        publisher: journal.publisher,
        doi: '10.5555/lgu.2026.001',
        publicationDate: new Date('2026-02-10'),
        year: 2026,
        volume: '18',
        issue: '1',
        pages: '44-62',
        openAccess: true,
        fileUrl: '/uploads/semantic-ranking-paper.pdf',
        status: 'PUBLISHED',
        journalId: journal.id,
        groupId: groupDiscovery.id,
        projectId: projectDiscovery.id,
        departmentId: depCs.id,
        researchAreaId: areaAi.id,
        keywords: { connect: [{ id: tagDiscovery.id }] },
      },
    }),
    prisma.publication.create({
      data: {
        title:
          'Adaptive Triage in Campus Cyber Incidents Through Context-Aware Alert Prioritization',
        slug: 'adaptive-triage-in-campus-cyber-incidents',
        abstract:
          'Presents a contextual triage model that reduces investigation fatigue in university security operations.',
        publicationType: 'CONFERENCE_PAPER',
        conferenceName: conference.name,
        publisher: conference.organizer,
        doi: '10.5555/lgu.2025.014',
        publicationDate: new Date('2025-11-18'),
        year: 2025,
        openAccess: false,
        status: 'UNDER_REVIEW',
        conferenceId: conference.id,
        groupId: groupCyber.id,
        projectId: projectCyber.id,
        departmentId: depCs.id,
        researchAreaId: areaCyber.id,
        keywords: { connect: [{ id: tagSecurity.id }] },
      },
    }),
    prisma.publication.create({
      data: {
        title:
          'Forecasting Campus Load Through Lightweight Smart-Grid Models for Resource-Constrained Deployments',
        slug: 'forecasting-campus-load-through-lightweight-smart-grid-models',
        abstract:
          'Explores forecasting methods for campuses with limited sensing infrastructure and varying seasonal load patterns.',
        publicationType: 'JOURNAL_ARTICLE',
        journalName: 'Energy Informatics Review',
        publisher: 'Energy Informatics Review',
        doi: '10.5555/lgu.2025.031',
        publicationDate: new Date('2025-08-02'),
        year: 2025,
        volume: '9',
        issue: '3',
        pages: '110-129',
        openAccess: true,
        status: 'PUBLISHED',
        groupId: groupEnergy.id,
        projectId: projectEnergy.id,
        departmentId: depEe.id,
        researchAreaId: areaEnergy.id,
        keywords: { connect: [{ id: tagEnergy.id }] },
      },
    }),
  ]);

  await prisma.publicationAuthor.createMany({
    data: [
      {
        publicationId: publicationDiscovery.id,
        researcherId: researcherSara.id,
        authorOrder: 1,
        correspondingAuthor: true,
      },
      {
        publicationId: publicationDiscovery.id,
        researcherId: researcherUsman.id,
        authorOrder: 2,
        correspondingAuthor: false,
      },
      {
        publicationId: publicationCyber.id,
        researcherId: researcherUsman.id,
        authorOrder: 1,
        correspondingAuthor: true,
      },
      {
        publicationId: publicationEnergy.id,
        researcherId: researcherAiman.id,
        authorOrder: 1,
        correspondingAuthor: true,
      },
    ],
  });

  await prisma.thesis.createMany({
    data: [
      {
        title: 'Semantic Search Patterns for Academic Research Portals',
        slug: 'semantic-search-patterns-for-academic-research-portals',
        abstract:
          'Examines retrieval and ranking strategies for research discovery systems in university contexts.',
        degreeLevel: 'MS',
        studentName: 'Mahnoor Tariq',
        supervisorId: researcherSara.id,
        departmentId: depCs.id,
        facultyId: facultySci.id,
        submissionDate: new Date('2025-12-12'),
        fileUrl: '/uploads/mahnoor-tariq-thesis.pdf',
        status: 'SUBMITTED',
        researchAreaId: areaAi.id,
      },
      {
        title: 'Threat Intelligence Prioritization for University Networks',
        slug: 'threat-intelligence-prioritization-for-university-networks',
        abstract:
          'Designs a scoring approach to align campus detection workflows with contextual threat intelligence.',
        degreeLevel: 'MS',
        studentName: 'Hassan Javed',
        supervisorId: researcherUsman.id,
        departmentId: depCs.id,
        facultyId: facultySci.id,
        submissionDate: new Date('2025-09-08'),
        status: 'APPROVED',
        researchAreaId: areaCyber.id,
      },
      {
        title: 'Load Optimization for Smart Campus Distribution Systems',
        slug: 'load-optimization-for-smart-campus-distribution-systems',
        abstract:
          'Evaluates demand-side optimization strategies for campus micro-distribution networks.',
        degreeLevel: 'PHD',
        studentName: 'Mariam Saleem',
        supervisorId: researcherAiman.id,
        departmentId: depEe.id,
        facultyId: facultyEng.id,
        submissionDate: new Date('2024-11-21'),
        status: 'PUBLISHED',
        researchAreaId: areaEnergy.id,
      },
    ],
  });

  await prisma.newsItem.createMany({
    data: [
      {
        title: 'LGU Research Showcase Highlights Interdisciplinary Projects Across Faculties',
        slug: 'lgu-research-showcase-highlights-interdisciplinary-projects',
        summary:
          'Faculty teams presented applied research in AI, cyber resilience, digital policy, and energy optimization.',
        content:
          'Faculty teams presented applied research in AI, cyber resilience, digital policy, and energy optimization during the annual LGU research showcase.',
        publishedAt: new Date('2026-03-15'),
        category: 'EVENT',
        status: 'PUBLISHED',
      },
      {
        title: 'LGU Secures Support for Campus Cyber Range Expansion',
        slug: 'lgu-secures-support-for-campus-cyber-range-expansion',
        summary:
          'The new phase extends infrastructure for incident simulation, forensic training, and collaborative defense exercises.',
        content:
          'LGU will expand its campus cyber range infrastructure to support incident simulation and collaborative defense training.',
        publishedAt: new Date('2026-02-05'),
        category: 'NEWS',
        status: 'APPROVED',
        departmentId: depCs.id,
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: userOric.id,
        action: 'publication.approved',
        entityType: 'Publication',
        entityId: publicationDiscovery.id,
        metadata: { title: publicationDiscovery.title },
      },
      {
        actorId: userSuperAdmin.id,
        action: 'researcher.published',
        entityType: 'ResearcherProfile',
        entityId: researcherUsman.id,
        metadata: { slug: researcherUsman.slug },
      },
    ],
  });
}
