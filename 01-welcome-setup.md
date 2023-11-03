# OpenTelemetry metrics on Kubernetes tutorial

Welcome to the OpenTelemetry metrics on Kubernetes tutorial!
This tutorial is continuation of [KubeCon EU 2023 OpenTelemetry on Kubernetes tutorial](https://github.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial).
Today we will focus on collecting metrics on Kubernetes with OpenTelemetry.
We will use OpenTelemetry API/SDK, collector, operator and auto-instrumentation libraries.

See [the agenda](./README.md#agenda)

## Setup infrastructure

### Kubectl

Almost all the following steps in this tutorial require kubectl. Your used version should not differ more than +-1 from the used cluster version. Please follow [this](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-kubectl-binary-with-curl-on-linux) installation guide.

### Kind

If [go](https://go.dev/) is installed on your machine, `kind` can be easily installed as follows:

```bash
go install sigs.k8s.io/kind@v0.18.0
```

If this is not the case, simply download the [kind-v0.20.0](https://github.com/kubernetes-sigs/kind/releases/tag/v0.20.0) binary from the release page. (Other versions will probably work too. :cowboy_hat_face:)

### Create a workshop cluster

After a successful installation, a cluster can be created as follows:

```bash
kind create cluster --name=workshop --image kindest/node:v1.27.3
```

Kind automatically sets the kube context to the created workshop cluster. We can easily check this by getting information about our nodes.

```bash
kubectl get nodes
```
Expected is the following:

```bash
NAME                     STATUS   ROLES           AGE   VERSION
workshop-control-plane   Ready    control-plane   75s   v1.27.3
```

### Cleanup

```bash
kind delete cluster --name=workshop
```

## Deploy initial services

### Deploy cert-manager

[cert-manager](https://cert-manager.io/docs/) is used by OpenTelemetry operator to provision TLS certificates for admission webhooks.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
```

### Deploy OpenTelemetry operator

```bash
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.88.0/opentelemetry-operator.yaml
```

### Deploy observability backend

This course is all about Observabilty, so a backend is needed. If you don't have one, you can install Prometheus for metrics and Jaeger for traces as follows:

```bash
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-na-2023-opentelemetry-kubernetes-metrics-tutorial/main/backend/01-backend.yaml
```

Afterwards, the backend can be found in the namespace `observability-backend`. A grafana dashboard with preconfigured datasources and dashboard is available for visualisation and can be made accessible with port-fowarding.

```bash
kubectl port-forward -n observability-backend svc/grafana 3000:3000
```

Open it in the browser [localhost:3000](http://localhost:3000/)
