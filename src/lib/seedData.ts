import { Project, Certification, BlogPost } from '../types';

export const INITIAL_POSTS: Omit<BlogPost, 'id'>[] = [
  {
    title: 'Building AI-Augmented Cloud Infrastructure with Gemini API and Terraform',
    summary: 'How we integrate Gemini models into automated IaC linting pipelines to detect security compliance drift, optimize Kubernetes manifests, and accelerate incident response.',
    content: `# Building AI-Augmented Cloud Infrastructure with Gemini API and Terraform

In modern DevOps workflows, speed and reliability are often seen as competing priorities. As Cloud & DevOps Engineers, we strive to ship infrastructure updates quickly without compromising security guardrails or breaking production environments.

At **Freda Creations**, we have been experimenting with **AI-augmented Infrastructure as Code (IaC)** workflows by pairing **Terraform** with the **Google Gemini API**. Here is how we built a resilient pipeline that catches security drift and optimizes Kubernetes manifests before they ever hit production.

---

## 1. The Challenge of IaC Compliance Drift

Infrastructure configuration files often accumulate subtle anti-patterns over time:
- Overly permissive IAM role policies (\`"Action": "*"\`)
- Unencrypted S3 buckets or unmasked secrets
- Non-standard ingress routing rules in Kubernetes Helm charts

While static analysis tools like \`tfsec\` or \`checkov\` catch known static vulnerability signatures, they lack contextual awareness regarding system architecture or custom corporate security policies.

---

## 2. Integrating Gemini 2.5 Flash in CI/CD Pipelines

By integrating Gemini 2.5 Flash directly into our GitHub Actions or GitLab CI pipelines, we pass generated Terraform plans (\`terraform show -json tfplan.json\`) to Gemini via the \`@google/genai\` SDK.

### Sample Pipeline Script Snippet

\`\`\`bash
# Generate execution plan in JSON
terraform plan -out=tfplan.binary
terraform show -json tfplan.binary > tfplan.json

# Analyze plan with Gemini auditor agent
node scripts/audit-plan.js tfplan.json
\`\`\`

### What Gemini Evaluates:
1. **Cost Anomaly Detection**: Highlights unexpected resource creations (e.g. provisioning \`m5.24xlarge\` instances instead of \`t4g.micro\`).
2. **IAM Principle of Least Privilege**: Suggests restricted policy statements based on actual runtime workload requirements.
3. **Resilience & Fault Tolerance**: Flags single-AZ deployments for critical production databases.

---

## 3. Real-World Results from AlertGH & Event Ticketing K8s

Implementing this AI-assisted audit pipeline delivered tangible metrics:
- **85% reduction** in post-deployment cloud misconfigurations.
- **40% faster code review cycle** for complex infrastructure pull requests.
- **Zero security incidents** across all hosted services in Accra.

---

## Conclusion & Best Practices

AI should not replace human engineering rigor—it should amplify it. By combining Terraform's deterministic state management with Gemini's reasoning capabilities, we create cloud systems that are both fast and rock-solid.

> *"Rooting cloud technology in Ghanaian identity means building infrastructure that empowers local communities with global resilience."* — Freda Ofori
`,
    date: 'July 20, 2026',
    author: 'Freda Ofori',
    authorRole: 'Cloud & DevOps Engineer',
    readTime: '6 min read',
    tags: ['AI & Cloud', 'Terraform', 'Gemini API', 'DevOps'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    featured: true,
    order: 1,
    createdAt: new Date('2026-07-20').toISOString()
  },
  {
    title: 'Zero-Downtime Kubernetes Deployments: Blue-Green & Canary Strategies',
    summary: 'A deep dive into zero-downtime deployment strategies, Pod Disruption Budgets, Horizontal Pod Autoscalers, and Prometheus metrics for high-traffic applications.',
    content: `# Zero-Downtime Kubernetes Deployments: Blue-Green & Canary Strategies

When handling high-traffic platforms like event ticketing systems during peak demand, even 30 seconds of service outage can result in thousands of failed transactions. Achieving zero-downtime updates is a prerequisite for production-grade Kubernetes deployments.

In this guide, I share practical patterns developed during the deployment of our containerized **Event Registration & Ticketing System**.

---

## Key Building Blocks

To ensure seamless transitions during rolling updates, your cluster configuration must enforce three essential mechanisms:

### 1. Readiness & Liveness Probes
Never rely solely on container startup status. Configure HTTP or TCP readiness probes so Kubernetes traffic is only routed when the service is fully booted and database connections are verified.

\`\`\`yaml
readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
\`\`\`

### 2. Pod Disruption Budgets (PDB)
Prevent node drains or cluster upgrades from taking down all replicas simultaneously:

\`\`\`yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: ticketing-api-pdb
spec:
  minAvailable: 80%
  selector:
    matchLabels:
      app: ticketing-api
\`\`\`

### 3. Horizontal Pod Autoscaling (HPA)
Autoscale based on custom metrics (e.g. active HTTP request rates or CPU utilization threshold above 70%).

---

## Observability with Prometheus & Grafana

Zero-downtime is only as good as your visibility. We track:
- **P99 Latency**: Ensuring response times stay under 150ms.
- **HTTP 5xx Error Rates**: Automatic rollback triggers via Flagger if HTTP 5xx errors exceed 0.5% during canary analysis.

---

## Summary

By combining automated canary deployments with robust observability stacks, you eliminate fear from release day. Deploying to production becomes a routine, silent non-event.
`,
    date: 'June 28, 2026',
    author: 'Freda Ofori',
    authorRole: 'Cloud & DevOps Engineer',
    readTime: '8 min read',
    tags: ['Kubernetes', 'DevOps', 'Docker', 'Prometheus'],
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    featured: true,
    order: 2,
    createdAt: new Date('2026-06-28').toISOString()
  }
];

export const INITIAL_PROJECTS: Omit<Project, 'id'>[] = [
  {
    title: 'AlertGH',
    description: 'Civic tech emergency reporting Progressive Web App empowering citizens across Ghana to report real-time hazards, disasters, and community issues with AI-assisted threat triaging.',
    category: 'AI & Civic Tech',
    techStack: ['React 19', 'TypeScript', 'Firebase', 'Gemini API', 'Tailwind CSS', 'PWA'],
    liveUrl: 'https://alertgh-11142.web.app',
    githubUrl: 'https://github.com/fredaesiofori/AlertGH.git',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    featured: true,
    order: 1,
    createdAt: new Date('2025-01-15').toISOString()
  },
  {
    title: 'FoodBridge',
    description: 'Sustainable food donation and distribution platform connecting local restaurants, supermarkets, and catering services with community food shelters in Accra.',
    category: 'Full-Stack & PWA',
    techStack: ['React', 'TypeScript', 'Firebase Firestore', 'Vercel', 'Tailwind CSS'],
    liveUrl: 'https://food-bridge-silk.vercel.app',
    githubUrl: 'https://github.com/fredaesiofori/FoodBridge.git',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    featured: true,
    order: 2,
    createdAt: new Date('2025-02-10').toISOString()
  },
  {
    title: 'Event Registration & Ticketing System',
    description: 'Cloud-native, containerized ticketing platform built for extreme traffic spikes during major tech summits. Features automated autoscaling and full observability stacks.',
    category: 'Cloud & DevOps',
    techStack: ['Docker', 'Kubernetes', 'Prometheus', 'Grafana', 'Node.js', 'Helm'],
    liveUrl: 'https://event-registration-system-freda-creations.vercel.app',
    githubUrl: 'https://github.com/fredaesiofori/event-registration-system.git',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    featured: true,
    order: 3,
    createdAt: new Date('2025-03-01').toISOString()
  },
  {
    title: 'Serverless To-Do App on AWS',
    description: 'Infrastructure-as-Code driven serverless task management platform leveraging event-driven architecture, zero server management, and sub-second latency global endpoints.',
    category: 'Serverless',
    techStack: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Terraform', 'React', 'TypeScript'],
    liveUrl: 'https://todo.fredacreations.dev',
    githubUrl: 'https://github.com/fredaesiofori/aws-serverless-todo',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    featured: false,
    order: 4,
    createdAt: new Date('2025-03-20').toISOString()
  },
  {
    title: 'AWS Cloud Architecture Capstone',
    description: 'Enterprise multi-tier AWS architecture design featuring Multi-AZ fault tolerance, CloudFront CDN edge caching, VPC subnets, IAM role security, and Auto Scaling groups.',
    category: 'Cloud & DevOps',
    techStack: ['AWS EC2', 'AWS S3', 'CloudFront', 'Auto Scaling', 'VPC', 'Route 53'],
    liveUrl: 'https://architecture.fredacreations.dev',
    githubUrl: 'https://github.com/Aliu2211/azubi_capsotone_project.git',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    featured: false,
    order: 5,
    createdAt: new Date('2025-04-05').toISOString()
  },
  {
    title: 'SmartSpend',
    description: 'Personal financial tracking and smart budget management app with intuitive interactive analytics, custom category budgets, and multi-currency conversion support.',
    category: 'Full-Stack & PWA',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'IndexedDB'],
    liveUrl: 'https://smartspend905.lovable.app',
    githubUrl: 'https://github.com/fredaesiofori/smartspend905.git',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    featured: false,
    order: 6,
    createdAt: new Date('2025-04-18').toISOString()
  }
];

export const INITIAL_CERTIFICATIONS: Omit<Certification, 'id'>[] = [
  {
    title: 'AWS Knowledge: Cloud Essentials',
    issuer: 'AWS Training & Certification',
    issueDate: 'July 2026',
    credentialUrl: 'https://www.credly.com/badges/9661204a-8ea2-4423-9732-1826cf08c475/public_url',
    imageUrl: '/aws-cloud-essentials-badge.svg',
    order: 1,
    createdAt: new Date('2026-07-25').toISOString()
  },
  {
    title: 'AWS Knowledge: Amazon Q Developer Fundamentals',
    issuer: 'AWS Training & Certification',
    issueDate: 'July 2026',
    credentialUrl: 'https://www.credly.com/badges/3d21ba0f-6f80-4221-a7ca-78f0dfd6f850/public_url',
    imageUrl: '/aws-amazon-q-badge.svg',
    order: 2,
    createdAt: new Date('2026-07-20').toISOString()
  },
  {
    title: 'Google Ads for Beginners',
    issuer: 'Coursera',
    issueDate: 'June 2026',
    credentialUrl: 'https://coursera.org/verify/2TIO7919CAA3',
    imageUrl: '/coursera-google-ads.svg',
    order: 3,
    createdAt: new Date('2026-06-04').toISOString()
  },
  {
    title: 'Siemens Project Manager Job Simulation',
    issuer: 'Siemens / Forage',
    issueDate: 'June 2026',
    credentialUrl: 'https://www.theforage.com/simulations/siemens/project-management',
    imageUrl: '/siemens-forage-cert.svg',
    order: 4,
    createdAt: new Date('2026-06-19').toISOString()
  },
  {
    title: 'Cloud Computing & AI Specialist',
    issuer: 'Azubi Africa',
    issueDate: '2025',
    credentialUrl: 'https://azubiafrica.org/verify',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    order: 5,
    createdAt: new Date('2025-02-15').toISOString()
  },
  {
    title: 'BTECH in Computer Science',
    issuer: 'Accra Technical University',
    issueDate: '2026',
    credentialUrl: 'https://atu.edu.gh',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
    order: 6,
    createdAt: new Date('2026-01-10').toISOString()
  }
];
