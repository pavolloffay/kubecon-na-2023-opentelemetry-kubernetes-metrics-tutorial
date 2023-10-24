# OpenTelemetry metrics instrumentation

This tutorial step focuses on instrumenting the services of the
[sample application](./app).

## Application Description

The sample application is a simple _"dice game"_, where two players roll a
dice, and the player with the highest number wins.

There are 3 microservices within this application:

- Service `frontend` in Node.JS, that has an API endpoint `/` which takes two
  player names as query parameters (player1 and player2). The service calls 2
  down stream services (backend1, backend2), which each returning a random number
  between 1-6. The winner is computed and returned.
- Service `backend1` in python, that has an API endpoint `/rolldice` which takes
  a player name as query parameter. The service returns a random number between
  1 and 6.
- Service `backend2` in Java, that also has an API endpoint `/rolldice` which
  takes a player name as query parameter. The service returns a random number
  between 1 and 6.

Additionally there is a `loadgen` service, which utilizes `curl` to periodically
call the frontend service.

Let's assume player `alice` and `bob` use our service, here's a potential
sequence diagram:

```mermaid
sequenceDiagram
    loadgen->>frontend: /?player1=bob&player2=alice
    frontend->>backend1: /rolldice?player=bob
    frontend->>backend2: /rolldice?player=alice
    backend1-->>frontend: 3
    frontend-->>loadgen: bob rolls: 3
    backend2-->>frontend: 6
    frontend-->>loadgen: alice rolls: 6
    frontend-->>loadgen: alice wins
```

## Manual or Automatic Instrumentation?

To make your application emit traces, metrics & logs you can either instrument
your application _manually_ or _automatically_:

- Manual instrumentation means that you modify your code yourself: you initialize and
  configure the SDK, you load instrumentation libraries, you create your own spans,
  metrics, etc.
  Developers can use this approach to tune the observability of their application to
  their needs.
- Automatic instrumentation means that you don't have to touch your code to get your
  application emit code.
  Automatic instrumentation is great to get you started with OpenTelemetry, and it is
  also valuable for Application Operators, who have no access or insights about the
  source code.

In the following we will introduce you to both approaches.

## Manual Instrumentation

* Use API to create custom metrics
* Configure exporter OTLP/Prometheus

##  Auto-instrumentation

* Which languages are supported and emit metrics
* Run the agent locally?

---
[Next steps](./04-operator-introduction.md)
