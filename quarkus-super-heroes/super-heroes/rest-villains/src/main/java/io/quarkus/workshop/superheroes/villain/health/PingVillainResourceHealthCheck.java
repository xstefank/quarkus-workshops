package io.quarkus.workshop.superheroes.villain.health;

import io.quarkus.workshop.superheroes.villain.VillainResource;
import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;

/**
 * {@link HealthCheck} to ping the Hero service
 */
@Liveness
public class PingVillainResourceHealthCheck implements HealthCheck {

    @Inject
    VillainResource villainResource;

    @Override
    public HealthCheckResponse call() {
        String response = villainResource.hello();
        return HealthCheckResponse.named("Ping Villain REST Endpoint").withData("Response", response).up().build();
    }
}
