#include <Arduino.h>
#if defined(ESP8266)
    #include <ESP8266WiFi.h>
#elif defined(ESP32)
    #include <WiFi.h>
#endif
#include <ESPAsyncWebServer.h>
#include "fauxmoESP.h"
#include <ArduinoJson.h>


#include <IRremoteESP8266.h>
#include <IRsend.h>

const uint16_t kIrLed = 4;  // ESP8266 GPIO pin to use. Recommended: 4 (D2).
IRsend irsend(kIrLed);  // Set the GPIO to be used to sending the message.

bool webRequest = false;


#include "credentials.h"
#include "myir_raw.h"

fauxmoESP fauxmo;
AsyncWebServer server(80);
StaticJsonDocument<200> doc;

// -----------------------------------------------------------------------------

#define SERIAL_BAUDRATE                 115200

// -----------------------------------------------------------------------------
// Wifi
// -----------------------------------------------------------------------------

void wifiSetup() {

    // Set WIFI module to STA mode
    WiFi.mode(WIFI_STA);

    // Connect
    Serial.printf("[WIFI] Connecting to %s ", WIFI_SSID);
    WiFi.begin(WIFI_SSID, WIFI_PASS);

    // Wait
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(100);
    }
    Serial.println();

    // Connected!
    Serial.printf("[WIFI] STATION Mode, SSID: %s, IP address: %s\n", WiFi.SSID().c_str(), WiFi.localIP().toString().c_str());

}

void ac_pwr() {
  irsend.sendRaw(AC_PWR, AC_LEN, IR_FREQ);
}

void tv_pwr() {
  irsend.sendRaw(TV_PWR, TC_LEN, IR_FREQ);
}

void serverSetup() {


    // These two callbacks are required for gen1 and gen3 compatibility
    server.onRequestBody([](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
        Serial.println("Running");
        if (fauxmo.process(request->client(), request->method() == HTTP_GET, request->url(), String((char *)data))) return;
        // Handle any other body request here...
        if (request->url() == "/index.html" && request->method() == HTTP_POST) {
          const char* json_str = (const char*)data;
          DeserializationError err = deserializeJson(doc, json_str);
          if (err) {
            request->send(400, "text/plain", err.c_str());
          } else {
            webRequest = true;
            request->send(200, "text/plain", "processing input");
          }

        }
    });
    server.onNotFound([](AsyncWebServerRequest *request) {
        String body = (request->hasParam("body", true)) ? request->getParam("body", true)->value() : String();
        if (fauxmo.process(request->client(), request->method() == HTTP_GET, request->url(), body)) return;
        // Handle not found request here...
    });

    server.begin();

}

void processWebRequest() {
  JsonObject obj = doc.as<JsonObject>();
  for (JsonPair p : obj) {
    int value = p.value().as<int>();
    const char* key = p.key().c_str();

    if (value == 0) continue;
   
    // TODO: handle keys
  }
  
  
}

void setup() {

    irsend.begin();

    Serial.begin(SERIAL_BAUDRATE);
    Serial.println();
    Serial.println();

    wifiSetup();

    serverSetup();

    fauxmo.createServer(false);
    fauxmo.setPort(80); // This is required for gen3 devices

    fauxmo.enable(false);
    fauxmo.enable(true);

    fauxmo.addDevice("air conditioner");
    fauxmo.addDevice("television");
    
    fauxmo.onSetState([](unsigned char device_id, const char * device_name, bool state, unsigned char value) {
        
        // Callback when a command from Alexa is received. 
        
        Serial.printf("[MAIN] Device #%d (%s) state: %s value: %d\n", device_id, device_name, state ? "ON" : "OFF", value);

        if (strcmp(device_name, "air conditioner") == 0) {
          ac_pwr();
        } else if (strcmp(device_name, "television") == 0) {
          tv_pwr();
        }

    });

}

void loop() {

    fauxmo.handle();
    if (webRequest) {
      webRequest = false;
      processWebRequest();
    }

    // This is a sample code to output free heap every 5 seconds
    // This is a cheap way to detect memory leaks
    static unsigned long last = millis();
    if (millis() - last > 5000) {
        last = millis();
        Serial.printf("[MAIN] Free heap: %d bytes\n", ESP.getFreeHeap());
    }

}
