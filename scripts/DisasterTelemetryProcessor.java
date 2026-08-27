package scripts;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * DisasterTelemetryProcessor.java
 * Java utility for processing telemetry feeds and computing geotechnical safety
 * factors.
 * Part of Dhristi Geo-Intelligence Platform.
 */
public class DisasterTelemetryProcessor {

    public static class HazardZone {
        private String id;
        private String name;
        private double rainfallRate; // mm/hr
        private double soilSaturation; // percentage (0-100)
        private double factorOfSafety; // < 1.0 is critical failure

        public HazardZone(String id, String name, double rainfallRate, double soilSaturation, double factorOfSafety) {
            this.id = id;
            this.name = name;
            this.rainfallRate = rainfallRate;
            this.soilSaturation = soilSaturation;
            this.factorOfSafety = factorOfSafety;
        }

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public double getRainfallRate() {
            return rainfallRate;
        }

        public double getSoilSaturation() {
            return soilSaturation;
        }

        public double getFactorOfSafety() {
            return factorOfSafety;
        }

        public boolean isRedAlert() {
            return this.factorOfSafety < 1.0 || this.rainfallRate > 50.0 || this.soilSaturation > 90.0;
        }

        public String getRiskStatus() {
            if (this.factorOfSafety < 1.0 || this.rainfallRate > 50.0 || this.soilSaturation > 90.0) {
                return "CRITICAL_RED";
            }
            if (this.factorOfSafety < 1.3 || this.rainfallRate > 30.0 || this.soilSaturation > 75.0) {
                return "WARNING_AMBER";
            }
            return "STABLE_GREEN";
        }

        public String toJson() {
            return String.format("{\"id\":\"%s\",\"name\":\"%s\",\"factorOfSafety\":%.2f,\"rainfallRate\":%.1f,\"soilSaturation\":%.1f,\"status\":\"%s\",\"isRedAlert\":%b}",
                    id, name, factorOfSafety, rainfallRate, soilSaturation, getRiskStatus(), isRedAlert());
        }

        @Override
        public String toString() {
            return String.format("[%s] %s | FS: %.2f | Rain: %.1f mm/h | Soil: %.1f%% | Status: %s",
                    id, name, factorOfSafety, rainfallRate, soilSaturation, getRiskStatus());
        }
    }

    public static int processTelemetryBatch(HazardZone[] zones) {
        int redCount = 0;
        for (HazardZone zone : zones) {
            System.out.println(zone);
            if (zone.isRedAlert()) {
                redCount++;
            }
        }
        return redCount;
    }

    public static void main(String[] args) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z");
        String formattedTimestamp = LocalDateTime.now().atZone(ZoneId.systemDefault()).format(formatter);

        System.out.println("=================================================");
        System.out.println("  Dhristi Disaster Telemetry Processor (Java)");
        System.out.println("  Timestamp: " + formattedTimestamp);
        System.out.println("=================================================\n");

        HazardZone[] zones = new HazardZone[] {
                new HazardZone("HZ-01", "Wayanad Slope Sector 4B", 68.5, 94.2, 0.82),
                new HazardZone("HZ-02", "Chamoli Ravine Flow Path", 54.0, 91.0, 0.91),
                new HazardZone("HZ-03", "Munnar Tea Estate Ridge", 32.1, 78.4, 1.25),
                new HazardZone("HZ-04", "Kedarnath Upper Catchment", 12.4, 45.0, 1.88)
        };

        int redCount = processTelemetryBatch(zones);

        System.out.println("\n-------------------------------------------------");
        System.out.println("Summary: " + redCount + " of " + zones.length
                + " monitored zones require IMMEDIATE evacuation dispatch.");
        System.out.println("-------------------------------------------------");
    }
}
