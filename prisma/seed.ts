const defaultOrg = await prisma.organization.create({
  data: {
    name: "Default Organization",
    description: "Default organization for new users",
  }
});

console.log('Created default organization with ID:', defaultOrg.id);