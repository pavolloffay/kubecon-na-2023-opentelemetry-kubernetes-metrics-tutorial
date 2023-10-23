# Collecting Prometheus Metrics: A Seamless Transition to OpenTelemetry

## Tutorial Highlights

1. **Migrating** from Prometheus to OpenTelemetry
2. **Scaling** metrics collection with the Target Allocator
3. **Interoperability** between Prometheus and OpenTelemetry standards through conversion techniques
4. **Considerations** and current limitations

## Usecase

Prometheus, a cornerstone of our monitoring landscape, has been widely embraced by the community. While the end goal is transitioning to OpenTelemetry, which includes implementing OpenTelemetry instrumentation, this journey involves framework updates and significant rewriting.

The transition to OpenTelemetry can be gradual and incremental. This tutorial primarily focuses on the process of migrating metrics from Prometheus to OpenTelemetry.

TODO: Insert diagram to depict the state with Promtheus

## Environment Setup 

- **Demo Application**:
  - Backend 2 application deployed on a local Kind cluster.
  - The application has been instrumented to generate Prometheus metrics.

- **Prometheus Configuration**:
  - Prometheus is installed within the environment.
  - Configured with remote write enabled to export metrics in the Prometheus format.

- **Grafana Mimir**:
  - Grafana Mimir is installed within the environment
  - Mimir supports native OTLP over HTTP

## 1. Migrating from Prometheus to OpenTelemetry

**Step 1: Prometheus Target Discovery Configrations**

1. **Native Prometheus Service Discovery**

    ```yaml
    scrape_configs:

      # App metrics - Scraping job using 'static_config'
      - job_name: 'backend1-scrape-job'
        scrape_interval: 1m
        static_configs:
          - targets: ["my-target:8888"]

      # Monitoring the monitoring - Prometheus self Telemetry
      - job_name: 'self-telemetry-prometheus'
        scrape_interval: 30s
        static_configs:
          - targets: ["localhost:9090"]
        
    # Remote write exporter
    remote_write:
      - url: <REMOTE_WRITE_ENDPOINT>
      ```
2. **Service Discovery with Prometheus operator using Service and Pod Monitors**

    The Prometheus operator is a huge help in the Kubernetes metrics world. It lets us define [Prometheus CR's](https://github.com/prometheus-operator/prometheus-operator#customresourcedefinitions) and makes Prometheus scrape configurations much simpler.

    In order to apply a pod or service monitor, the CRDs need to be installed:

    ```shell
    kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml

    kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_podmonitors.yaml
    ```

    You can verify both CRDs are present with the command `kubectl get customresourcedefinitions`, and then the below lines 
    should be included in your list of CRDs (dates will differ):
    ```shell
    podmonitors.monitoring.coreos.com          2023-04-11T22:17:04Z
    servicemonitors.monitoring.coreos.com      2023-04-11T22:16:58Z
    ```

    We now deploy ServiceMonitor for Backend1, which is a way to configure a scrape config with Prometheus Operator.

    Sample of ServiceMonitor:
      apiVersion: monitoring.coreos.com/v1
      kind: ServiceMonitor
      metadata:
        name: prometheus-self
        labels:
          prometheus: prometheus
      spec:
        endpoints:
          - interval: 30s
            port: web
        selector:
          matchLabels:
            prometheus: prometheus


**Step 2: OpenTelemetry Collector Setup**

The second step involves adapting the above Prometheus scenarios to OpenTelemetry collector. 

Key components include:

- **Prometheus Receiver:** This acts as a drop-in replacement for Prometheus

TODO: Add configuraions and deploy to kind

**Step 3: Exporting Metrics**

In the final step, we explore options to export our metrics:

**Exporters for Demo** 
- **Prometheus Remote Write:** Leverage ```prometheusremotewriteexporter ```for exporting metrics.

TODO: Add configuraions and deploy to kind

- **Grafana Mimir:** Utilize Grafana Mimir, opting for either the ```otlphttp``` exporter or prometheusremotewriteexporter for exporting metrics.

TODO: Add Sample configurations and deploy to kind

Other options:
- **Thanos Receive:** Utilize Thanos Receive, employing the prometheusremotewriteexporter for robust metric transmission.

- **Observability Vendors:** Choose from a variety of observability vendors, each with specific exporters available in the infrastructure-opentelemetry-contrib repository.



## 2. Scaling metreics pipeline using target allocator





## 3. Interoperability between Prometheus and OpenTelemetry standards through conversion techniques



## 4. Considerations** and current limitations


---
[Next steps](./06-collecting-k8s-infra-metrics.md)
