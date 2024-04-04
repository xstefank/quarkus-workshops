package io.quarkus.workshop.superheroes.fight.health;

import io.quarkus.workshop.superheroes.fight.FightResource;
import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;

/**
 * {@link HealthCheck} to ping the Hero service
 */
@Liveness
public class PingFightResourceHealthCheck implements HealthCheck {

    @Inject
    FightResource fightResource;

    @Override
    public HealthCheckResponse call() {
        String response = fightResource.hello();
        return HealthCheckResponse.named("Ping Fight REST Endpoint").withData("Response", response).up().build();
    }
}
