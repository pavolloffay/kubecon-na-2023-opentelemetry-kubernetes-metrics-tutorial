# Collecting Prometheus Metrics

This section of the tutorial will specifically focus on:

1. **Migrating** from Prometheus to OpenTelemetry
2. **Scaling** metrics collection with the Target Allocator
3. **Interoperability** between Prometheus and OpenTelemetry standards through conversion techniques
4. **Considerations** and current limitations

## Prerequisites

- **Demo Application**:
  - Backend 1 and Backend 2 apps deployed on a local Kind cluster.
  - Backend 1 application instrumented to generate OTLP format metrics.
  - Backend 2 application instrumented to generate Prometheus format metrics.

- **Prometheus Configuration**:
  - Prometheus is installed within the environment.
  - Configured with remote write enabled to export metrics.

## 1. Migrating from Prometheus to OpenTelemetry

Prometheus has been widely embraced by the community. While the end goal is transitioning to OpenTelemetry, which includes implementing OpenTelemetry instrumentation, this journey involves framework updates and rewriting. The transition to OpenTelemetry can be gradual and incremental. 

**Step 1: Prometheus Target Discovery Configrations**

1. **Native Prometheus Service Discovery**

    ```yaml
    scrape_configs:

      # App monitoring - Scraping job using 'static_config'
      - job_name: 'backend2-scrape-job'
        scrape_interval: 1m
        static_configs:
          - targets: ["my-target:8888"]

      # Monitoring the monitoring - Prometheus self Telemetry
      - job_name: 'prometheus-self'
        scrape_interval: 30s
        static_configs:
          - targets: ["localhost:9090"]
        
    # Remote write exporter
    remote_write:
      - url: <REMOTE_WRITE_ENDPOINT>
      ```
2. **Service Discovery with Prometheus operator using Service and Pod Monitors**

    The Prometheus operator lets us define [Prometheus CR's](https://github.com/prometheus-operator/prometheus-operator#customresourcedefinitions) and makes Prometheus scrape configurations much simpler.

    In order to apply a pod or service monitor, the CRDs need to be installed:

    ```shell
    kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml

    kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_podmonitors.yaml
    ```

    You can verify both CRDs are present with the command `kubectl get customresourcedefinitions`. After that, ensure that the following lines are added to your list of CRDs.

    ```shell
    podmonitors.monitoring.coreos.com         
    servicemonitors.monitoring.coreos.com      
    ```

**Step 2: OpenTelemetry Collector Setup**

  The second step involves adapting the above Prometheus scenarios to OpenTelemetry collector. 

  Key components include:

  - **Prometheus Receiver:** This acts as a drop-in replacement for Prometheus


**Step 3: Exporting Metrics**

  In the final step, we explore options to export our metrics:

  **Exporters for Demo**

  - **Prometheus Remote Write:** Leverage ```prometheusremotewriteexporter ```for exporting metrics.



## 2. Scaling metrics pipeline with the target allocator





## 3. Interoperability between Prometheus and OpenTelemetry standards through conversion techniques



## 4. Considerations and current limitations


---
[Next steps](./06-collecting-k8s-infra-metrics.md)
