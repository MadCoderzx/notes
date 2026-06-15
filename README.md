# Kubernetes & Minikube Hands-On Project

A practical project for learning Kubernetes (K8s) concepts by deploying a full-stack application on a local cluster using Minikube.

## What is Kubernetes?

Kubernetes is an open-source system for managing containerized applications at scale. Think of it as a traffic controller for your containers — it decides which server runs which container, restarts them if they crash, routes traffic between them, and scales them up or down.

**Why use it?**
- Runs your app across multiple machines as if it were one
- Automatically restarts failed containers
- Scales up when traffic spikes, scales down when it's quiet
- Deploys new versions with zero downtime (rolling updates)
- Manages secrets and configuration separately from code

**Where is it used?**
Cloud platforms (AWS EKS, Google GKE, Azure AKS), self-hosted data centers, and anywhere teams need to run microservices reliably at scale.

## What is Minikube?

Minikube runs a single-node Kubernetes cluster on your local machine. It gives you a real Kubernetes environment without needing cloud resources or multiple servers — perfect for learning, testing, and development.

## The Demo Application

A Notes Management app used as the workload to deploy:

- **Frontend** — React + Nginx (serves static files, proxies API calls to backend)
- **Backend** — Node.js + Express (REST API with JWT auth)
- **Database** — Remote PostgreSQL (connected via `DATABASE_URL`, tables auto-created on startup)

## Kubernetes Resources Used

| Resource | What it does | File |
|----------|-------------|------|
| **Deployment** | Defines how many replicas of a container to run, update strategy, health checks | `backend-deployment.yaml`, `frontend-deployment.yaml` |
| **Service** | Exposes pods via a stable DNS name and load balances traffic | `backend-service.yaml`, `frontend-service.yaml` |
| **ConfigMap** | Stores non-sensitive configuration (API URLs, env vars) | `configmap.yaml` |
| **Secret** | Stores sensitive data (DB URL, JWT secret) as base64 | `secret.yaml` |

### Key Concepts Demonstrated

- **Replicas** — Each deployment runs 2 pods for high availability
- **Health Checks** — Liveness probes restart unhealthy pods, readiness probes control traffic
- **Rolling Updates** — New versions deploy one pod at a time with zero downtime (`maxSurge: 1, maxUnavailable: 0`)
- **Service Discovery** — Frontend finds backend via K8s DNS (`backend-service:5000`), no hardcoded IPs
- **Init Containers** — Frontend uses an init container to substitute environment variables into nginx config before the main container starts
- **Scaling** — Deployments can be scaled to any number of replicas on demand

## Project Structure

```
notes/
├── docker-compose.yml          # Docker Compose (alternative to K8s)
├── client/                     # React frontend
│   ├── Dockerfile
│   ├── nginx.conf              # Uses $BACKEND_HOST placeholder
│   └── src/
├── server/                     # Express backend
│   ├── Dockerfile
│   ├── config/migrate.js       # Auto-creates DB tables on startup
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
└── k8s/                        # Kubernetes manifests
    ├── configmap.yaml
    ├── secret.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    └── frontend-service.yaml
```

## Prerequisites

- **Docker** >= 24 — [Install Docker](https://docs.docker.com/get-docker/)
- **Minikube** — [Install Minikube](https://minikube.sigs.k8s.io/docs/start/)
- **kubectl** — Comes with Minikube, or [install separately](https://kubernetes.io/docs/tasks/tools/)

## Setup

### 1. Start Minikube

```bash
minikube start
```

This creates a local VM (or container) running a Kubernetes cluster.

### 2. Configure Docker to use Minikube's daemon

This makes `docker build` create images inside Minikube so they're available to the cluster without pushing to a registry:

```bash
eval $(minikube docker-env)
```

> On Windows (PowerShell):
> ```powershell
> minikube docker-env | Invoke-Expression
> ```

### 3. Build container images

```bash
docker compose build
```

### 4. Configure secrets

Add your database URL and JWT secret to `server/.env`:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_random_secret
PORT=5000
```

The `DATABASE_URL` should point to any reachable PostgreSQL instance (Supabase, Render, Neon, etc.).

Also edit `k8s/secret.yaml` (it uses `stringData` for plain text), then run `kubectl apply -f k8s/secret.yaml`.

Make sure not to accidentally commit those secrets.

### 5. Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

This applies all manifests in order — ConfigMap, Secret, Deployments, and Services.

### 6. Verify deployment

```bash
kubectl get pods
kubectl get services
kubectl get deployments
```

You should see all pods in `Running` status:

```
NAME                                    READY   STATUS    RESTARTS   AGE
backend-deployment-xxx-xxx              1/1     Running   0          30s
backend-deployment-xxx-yyy              1/1     Running   0          30s
frontend-deployment-xxx-xxx             1/1     Running   0          30s
frontend-deployment-xxx-yyy             1/1     Running   0          30s
```

### 7. Access the application

```bash
minikube service frontend-service
```

This opens the frontend in your browser at the NodePort address (e.g., `http://192.168.49.2:30080`).

## Kubernetes Commands Cheat Sheet

### Inspect resources

```bash
kubectl get pods -o wide           # Pods with node/IP info
kubectl get services               # All services
kubectl get deployments            # All deployments
kubectl get configmaps             # All configmaps
kubectl get secrets                # All secrets
kubectl describe pod <pod-name>    # Detailed pod info
kubectl logs <pod-name>            # Pod logs
kubectl logs -f <pod-name>         # Stream logs live
```

### Scaling

```bash
# Scale backend to 3 replicas
kubectl scale deployment backend-deployment --replicas=3

# Watch pods being created
kubectl get pods -w
```

K8s will spin up a new pod and the Service will load-balance traffic across all 3.

### Rolling Updates

```bash
# Build a new version of the image
eval $(minikube docker-env)
cd server
docker build -t notes-backend:v2 .

# Update the deployment
kubectl set image deployment/backend-deployment backend=notes-backend:v2

# Watch the rollout
kubectl rollout status deployment/backend-deployment

# View rollout history
kubectl rollout history deployment/backend-deployment

# Rollback if something goes wrong
kubectl rollout undo deployment/backend-deployment
```

### ConfigMaps and Secrets

```bash
# View configmap contents
kubectl get configmap notes-config -o yaml

# View secret (values are base64 — decode them)
kubectl get secret notes-secrets -o yaml
```

### Cleanup

```bash
# Delete all K8s resources
kubectl delete -f k8s/

# Stop Minikube
minikube stop

# Delete Minikube cluster entirely
minikube delete
```

## Troubleshooting

**Pods stuck in `ImagePullBackOff`**
Make sure you ran `eval $(minikube docker-env)` before building images. The images must exist inside Minikube's Docker daemon.

**Pod in `CrashLoopBackOff`**
Check the logs:
```bash
kubectl logs <pod-name>
```
Common cause: `DATABASE_URL` is unreachable from inside the cluster.

**Backend can't connect to database**
The database must be reachable from inside the Minikube VM. `localhost` in the URL won't work — use the actual hostname/IP of your database provider.

**Frontend not proxying API calls**
Check the init container ran successfully:
```bash
kubectl logs <frontend-pod> -c envsubst
```

**Service not accessible**
```bash
minikube service frontend-service --url
```
If this returns a URL but nothing loads, check the frontend pods are Ready:
```bash
kubectl get pods -l app=notes-frontend
```

## Screenshots

| Minikube | Docker |
|-------|-----------|
| ![Minikube](screenshots/minikube.png) | ![Docker](screenshots/docker1.png) |

| Apply Kubernetes| Service|
|-------|-----------|
| ![Apply Kubernetes](screenshots/apply.png) | ![Service](screenshots/service.png) |