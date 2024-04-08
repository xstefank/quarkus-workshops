package io.quarkus.workshop.superheroes.statistics;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
class StatisticResourceTest {
    @Test
    void testHelloEndpoint() {
        given()
          .when().get("/api/stats")
          .then()
             .statusCode(200)
             .body(is("Hello from RESTEasy Reactive"));
    }

}