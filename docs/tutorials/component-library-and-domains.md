# Component Libraries & Domain Management Tutorial

> **Difficulty Level**: Intermediate to Advanced
> **Prerequisites**: React, TypeScript, npm package management
> **Version**: React 18+, Next.js 13+

## Quick Reference

```typescript
// Publishing a component library
// package.json
{
  "name": "@your-org/components",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build"
  }
}

// Domain management in Next.js
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  return NextResponse.rewrite(new URL(`/tenant/${subdomain}`, request.url));
}
```

## 1. Creating Reusable Component Libraries

### 1.1 Why Create a Component Library?

- **Reusability**: Use components across multiple projects
- **Consistency**: Maintain design and functionality standards
- **Maintenance**: Update components in one place
- **Testing**: Share test coverage across projects
- **Documentation**: Centralised component documentation

### 1.2 Library Structure

```
my-component-library/
├── src/
│   ├── components/
│   │   └── ComponentName/
│   │       ├── index.ts
│   │       ├── ComponentName.tsx
│   │       ├── ComponentName.test.tsx
│   │       └── types.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### 1.3 Exporting Components and Types

```typescript
// src/components/ComponentName/index.ts
export { default as ComponentName } from './ComponentName';
export * from './types';

// src/index.ts
export * from './components/ComponentName';
```

### 1.4 Publishing to npm

1. **Package Setup**:

   ```json
   {
     "name": "@your-org/component-library",
     "version": "1.0.0",
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "files": ["dist"]
   }
   ```

2. **Build Process**:

   ```json
   {
     "scripts": {
       "build": "tsc",
       "prepare": "npm run build"
     }
   }
   ```

3. **Publishing**:
   ```bash
   npm publish --access public
   ```

### 1.5 Using in Projects

```typescript
import { ComponentName, type ComponentNameProps } from '@your-org/component-library';
```

## 2. Domain Management in Multi-tenant Applications

### 2.1 Domain Structure Options

1. **Subdomain Approach**:

   ```
   [tenant-name].church.africa
   ```

2. **Path-based Approach**:

   ```
   church.africa/[tenant-name]
   ```

3. **Custom Domain**:
   ```
   [tenant-name].com
   ```

### 2.2 Subdomain Implementation

1. **DNS Configuration**:

   ```dns
   *.church.africa.  IN  A  [server-ip]
   ```

2. **SSL Setup**:

   ```bash
   certbot certonly --wildcard -d *.church.africa
   ```

3. **Next.js Middleware**:

   ```typescript
   export function middleware(request: NextRequest) {
     const hostname = request.headers.get('host') || '';
     const subdomain = hostname.split('.')[0];

     return NextResponse.rewrite(new URL(`/tenant/${subdomain}`, request.url));
   }
   ```

### 2.3 Tenant Isolation

1. **Database**:

   ```prisma
   model Tenant {
     id        String   @id @default(cuid())
     subdomain String   @unique
     name      String
     // ... other fields
   }
   ```

2. **Middleware**:

   ```typescript
   export async function middleware(request: NextRequest) {
     const hostname = request.headers.get('host') || '';
     const subdomain = hostname.split('.')[0];

     // Fetch tenant data
     const tenant = await prisma.tenant.findUnique({
       where: { subdomain },
     });

     if (!tenant) {
       return NextResponse.redirect(new URL('/404', request.url));
     }

     // Add tenant to request context
     const requestHeaders = new Headers(request.headers);
     requestHeaders.set('x-tenant-id', tenant.id);

     return NextResponse.next({
       request: {
         headers: requestHeaders,
       },
     });
   }
   ```

### 2.4 Custom Domain Support

1. **Domain Verification**:

   ```typescript
   async function verifyDomain(domain: string, tenantId: string) {
     // Add DNS TXT record
     // Verify ownership
     // Update tenant record
   }
   ```

2. **SSL Certificate**:
   ```typescript
   async function provisionSSL(domain: string) {
     // Request certificate
     // Install certificate
     // Update tenant configuration
   }
   ```

## 3. Best Practices

### 3.1 Component Library

1. **Versioning**:

   - Use semantic versioning
   - Document breaking changes
   - Provide migration guides

2. **Testing**:

   - Unit tests for all components
   - Integration tests for complex features
   - Visual regression testing

3. **Documentation**:
   - Storybook for visual documentation
   - API documentation
   - Usage examples

### 3.2 Domain Management

1. **Security**:

   - SSL for all domains
   - Rate limiting per tenant
   - Data isolation

2. **Performance**:

   - CDN configuration
   - Caching strategies
   - Resource limits

3. **Monitoring**:
   - Domain health checks
   - SSL certificate monitoring
   - Usage analytics

## Troubleshooting

### Common Issues

| Issue                                | Solution                                             |
| ------------------------------------ | ---------------------------------------------------- |
| Component library version conflicts  | Use semantic versioning and peer dependencies        |
| SSL certificate errors               | Verify DNS configuration and certificate renewal     |
| Subdomain not resolving              | Check wildcard DNS records and DNS propagation       |
| Cross-origin resource sharing (CORS) | Configure proper CORS headers for multi-domain setup |

### Debugging Tips

```typescript
// Debug component library issues
npm ls @your-org/component-library

// Check SSL certificate
echo | openssl s_client -servername tenant.example.com -connect tenant.example.com:443 2>/dev/null | openssl x509 -noout -dates

// Test subdomain resolution
nslookup tenant.example.com
```

## Related Tutorials

- [Storybook Setup](./storybook-setup.md)
- [Multi-tenant Database Design](./multi-tenant-database.md)
- [CI/CD for Component Libraries](./cicd-component-libraries.md)

## Further Reading

- [Monorepo Strategies](https://www.atlassian.com/git/tutorials/monorepos)
- [Multi-tenant Architecture](https://www.digitalocean.com/community/tutorials/multitenancy-in-web-applications)
- [Component-Driven Development](https://www.componentdriven.org/)

## Keywords

Component library, multi-tenant, subdomains, custom domains, npm packages, React components, SSL certificates, DNS configuration, middleware, Next.js
