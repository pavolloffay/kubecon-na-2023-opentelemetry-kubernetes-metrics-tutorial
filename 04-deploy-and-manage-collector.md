# Deploying collector and the app on Kubernetes

This tutorial step covers some [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector) and [OpenTelemetry Operator](https://github.com/open-telemetry/opentelemetry-operator) basics, introduction.

## Collector Overview

![OpenTelemetry Collector](images/otel-collector.png)


The OpenTelemetry Collector can be divided into a few major components.

- **Receivers**: Collect data from a specific source, like an application or infrastructure, and convert it into [pData (pipeline data)](https://pkg.go.dev/go.opentelemetry.io/collector/consumer/pdata#section-documentation). This component can be active (e.g. Prometheus) or passive (OTLP).
- **Processors**: Manipulates the data collected by receivers in some way. For example, a processor might filter out irrelevant data, or add metadata to help with analysis. Examples include the batch or metric renaming processor.
- **Exporters**: Send data to an external system for storage or analysis. Examples of exporters are Prometheus, Loki or the OTLP exporter.
- **Extensions**: Add additional functionality to OpenTelemetry collector that is not strictly related to the telemetry data, like configuring a bearer token or offering a Jaeger remote sampling endpoint.
- **Connectors**: Is both an exporter and receiver. It consumes data as an exporter in one pipeline and emits data as a receiver in another pipeline.

The components are composed into **pipelines**, that are separated by signal type (metrics, traces, logs). Each datapoint is then goes through the chain consisting receiver(s) -> processor(s) -> exporter(s). For more details, check the [offical documentation](https://opentelemetry.io/docs/collector/).

### Configuration

The configuration of the Open Telemetry Collector is described in YAML. The following shows an `OTLP/gRPC` receiver listening on `localhost:4317`. A batch processor with default parameters and a logging exporter with a normal log level. It also describes multiple pipelines for different telemetry data, which all route their collected telemetry data to the logging exporter.

The easiest way to learn more about the configuration options of individual components is to visit the readme in the component folder directly. Example [debugexporter](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.88.0/exporter/debugexporter#getting-started).

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 127.0.0.1:4317
processors:
  batch:

exporters:
  debug:
    verbosity: normal

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [debug]
```

### Run collector on K8s

By today the OpenTelemetry Operator offers two `CustomResouceDefinitions`.

1. The `v1alpha1.Instrumentation` can be used to configure applications that are configured with the OpenTelemetry-SDK and injection of auto-instrumentation libraries. Currently Apache HTTPD, DotNet, Go, Java, Nginx, NodeJS and Python are supported. [Readme](https://github.com/open-telemetry/opentelemetry-operator/blob/v0.88.0/README.md#opentelemetry-auto-instrumentation-injection)

2. The `v1alpha1.OpenTelemetryCollector` simplifies the operation of the OpenTelemetry Collector on Kubernetes. There are different deployment modes available, breaking config changes are migrated automatically, provides integration with Prometheus (including operating on Prometheus Operator CRs) and simplifies sidecar injection.

### Auto-instrumentation

Make sure the demo application is deployed and running:

```bash
kubectl apply -f app/k8s.yaml
```

To create an Instrumentation resource for our sample application run the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-na-2023-opentelemetry-kubernetes-metrics-tutorial/main/backend/04-metrics-auto-instrumentation.yaml
```

Content:
```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: demo-instrumentation
spec:
  exporter:
    endpoint: http://prometheus.observability-backend.svc.cluster.local:4318/api/v1/metrics
  propagators:
    - tracecontext
    - baggage
    - b3
  sampler:
    type: parentbased_traceidratio
    argument: "1"
```

Until now we only have created the Instrumentation resource, in a next step you need to opt-in your services for auto-instrumentation. This is done by updating your service's `spec.template.metadata.annotations`.

### Configure Node.JS - frontend service

You have instrumented the frontend service manually in a previous step. In a real world scenario you would now rebuild your container image, upload it into the registry and make use of it in your deployment:

```yaml
    spec:
      containers:
      - name: frontend
        image: ghcr.io/pavolloffay/kubecon-na-2023-opentelemetry-kubernetes-metrics-tutorial-frontend:latest
        env:
          - name: OTEL_INSTRUMENTATION_ENABLED
            value: "true"
```

To provide you with a shortcut here, we have prepared a way for you to use a manually instrumented version of the frontend: The environment variable `OTEL_INSTRUMENTATION_ENABLED` set to true will make sure that the `instrument.js` is included.

Before applying the annotation let's take a look at the pod specification:

```bash
kubectl get pods -n tutorial-application -l app=frontend -o yaml
```

All you need to do now, is to inject the configuration:
```bash
kubectl patch deployment frontend-deployment -n tutorial-application -p '{"spec": {"template":{"metadata":{"annotations":{"instrumentation.opentelemetry.io/inject-sdk":"true"}}}} }'
```

In case of using the auto-instrumentation, the follwoing annotation would be set:

```yaml
instrumentation.opentelemetry.io/inject-nodejs: "true"
```

Now verify that it worked:

```bash
kubectl get pods -n tutorial-application -l app=frontend -o yaml
```
and [access metrics]().

TODO: link dashboard + add screenshot

### OpenTelemetryCollector CR

TODO: Collect metrics e2e + filtering

---
[Next steps](./05-collecting-prometheus-metrics.md)
