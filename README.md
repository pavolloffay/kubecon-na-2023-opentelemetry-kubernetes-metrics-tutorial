# Tutorial Exploring the Power of Metrics Collection with OpenTelemetry on Kubernetes

This repository hosts content for Kubecon NA 2023 tutorial.

__Abstract__:
Deploying an observability system has many challenges, as several data types need to be collected. The data can be collected in many protocols and with different technology stacks. This session will cover end-to-end metrics collection on Kubernetes using the OpenTelemetry project. We will start from the ground up by instrumenting an application with OpenTelemetry APIs and agents and progressively solve more complicated use cases like a collection of resource attributes, collecting Prometheus metrics with the OpenTelemetry Collector and Operator, correlation with traces and logs, exemplars, and collecting Kubernetes infrastructure metrics.

__Schedule__:  https://kccncna2023.sched.com/event/1R2pr

__Slides__: 

__Recording__: 

---

## Tutorial

Each tutorial step is located in a separate file:

1. Welcome & Setup (Pavol, 5 min)
1. Introduction to OpenTelemetry and metrics (Pavol & Anthony) 
1. Instrumenting an app with OpenTelemetry metrics (Bene & Pavol)
1. Deploying collector and the app on Kubernetes (Bene, Matej)
1. Collecting Prometheus metrics (Anthony, Anusha)
1. Collecting Kubernetes infrastracture metrics (Matej, Anusha)
1. Correlation (Pavol)
1. Wrap up, what is coming to OpenTelemetry metrics 
