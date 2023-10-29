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

const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter(),
    metricReader: new PeriodicExportingMetricReader({
//        exporter: new OTLPMetricExporter(),
        exporter: new ConsoleMetricExporter()
    }),
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()
