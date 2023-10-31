/*
 * 
 *
 *
 * Use this file as a reference for your own instrumentation, but try to figure it out yourself
 * 
 * 
 * 
*/
const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-grpc");
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');

const { PeriodicExportingMetricReader, MeterProvider, ConsoleMetricExporter } = require('@opentelemetry/sdk-metrics')

const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const sdk = new opentelemetry.NodeSDK({
    resource: new Resource({
//        [SemanticResourceAttributes.SERVICE_NAME]: 'frontend',
//        [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
          ["my-org-service-version"]: '2.0.1',
    }),
    traceExporter: new OTLPTraceExporter(),
    metricReader: new PeriodicExportingMetricReader({
//        exporter: new OTLPMetricExporter(),
        exporter: new ConsoleMetricExporter()
    }),
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()
