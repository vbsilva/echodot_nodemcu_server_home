
#include <Arduino.h>
#if defined(ESP8266)
    #include <ESP8266WiFi.h>
#elif defined(ESP32)
    #include <WiFi.h>
#endif
#include <ESPAsyncWebServer.h>
#include "fauxmoESP.h"

#include "credentials.h"
#include "myir_raw.h"

#include <IRremoteESP8266.h>
#include <IRsend.h>
#include <Servo.h>
#include <SimpleTimer.h>
//#include <DHTesp.h>

#include <ArduinoJson.h>

SimpleTimer timer;

Servo servo;
const uint16_t servoPin = 14; // D5
const uint16_t ac_pos = 50;
const uint16_t tv_pos = 160;
const uint16_t servo_delay = 1000;

const uint16_t kIrLed = 4;  // D2.
IRsend irsend(kIrLed);

const uint16_t fanRelayPin = 16; // D0

const uint16_t debugLedPin = 0; // D3
bool debugLedState = false;

DynamicJsonDocument devices(1024);
char devices_json[256];

fauxmoESP fauxmo;
AsyncWebServer server(80);


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


void ac_remote() {
  irsend.sendRaw(AC_PWR, AC_LEN, IR_FREQ);
  digitalWrite(debugLedPin, LOW);
}

void ac_helper() {
  digitalWrite(debugLedPin, HIGH);
  servo.write(ac_pos);
  timer.setTimeout(servo_delay, ac_remote);
}

void tv_remote() {
  irsend.sendRaw(TV_PWR, TV_LEN, IR_FREQ);
  digitalWrite(debugLedPin, LOW);
}

void tv_helper() {  
  digitalWrite(debugLedPin, HIGH);
  servo.write(tv_pos);
  timer.setTimeout(servo_delay, tv_remote);
}


void setup_devices_json() {
  JsonObject fan = devices.createNestedObject("fan");
  //fan["device_name"] = "fan";
  fan["device_type"] = "relay";
  fan["value"] = 0;

  JsonObject ac = devices.createNestedObject("ac");
  //ac["device_name"] = "ac";
  ac["device_type"] = "general";
  ac["value"] = 0;

  JsonObject tv = devices.createNestedObject("tv");
  //tv["device_name"] = "tv";
  tv["device_type"] = "general";
  tv["value"] = 0;

  JsonObject temp = devices.createNestedObject("temp");
  //temp["device_name"] = "temp";
  temp["device_type"] = "sensor";
  temp["value"] = 0;
  
}

void serverSetup() {


    // These two callbacks are required for gen1 and gen3 compatibility
    server.onRequestBody([](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
        Serial.println("Request" + request->url());
        if (fauxmo.process(request->client(), request->method() == HTTP_GET, request->url(), String((char *)data))) return;
        // Handle any other body request here...
    });
    server.onNotFound([](AsyncWebServerRequest *request) {
        String body = (request->hasParam("body", true)) ? request->getParam("body", true)->value() : String();
        if (fauxmo.process(request->client(), request->method() == HTTP_GET, request->url(), body)) return;
        // Handle not found request here...
    });

    server.on("/devices", HTTP_GET, [](AsyncWebServerRequest *request) {
      devices["fan"]["value"] = digitalRead(fanRelayPin) ? 1: 0;
      devices["temp"]["value"] = String(random(20,40));
      serializeJson(devices, devices_json);
      request->send(200, "application/json", devices_json);
    });

    server.on("/ac", HTTP_GET, [](AsyncWebServerRequest *request) {
      ac_helper();
      request->send(200, "text/plain", "1");
    });

    server.on("/tv", HTTP_GET, [](AsyncWebServerRequest *request) {
      tv_helper();
      request->send(200, "text/plain", "1");
    });

    server.on("/fan", HTTP_GET, [](AsyncWebServerRequest *request) {
      AsyncWebParameter* state = request->getParam("state");
      int state_val = state->value().c_str()[0] - '0';
      state_val ? digitalWrite(fanRelayPin, HIGH) : digitalWrite(fanRelayPin, LOW);
      request->send(200, "text/plain", "1");
    });

    server.on("/temp", HTTP_GET, [](AsyncWebServerRequest *request) {       
      request->send(200, "text/plain", String(random(20,40)));
    });
    server.begin();

}


void setup() {
    setup_devices_json();
    irsend.begin();

    pinMode(fanRelayPin, OUTPUT);
    digitalWrite(fanRelayPin, LOW);

    pinMode(debugLedPin, OUTPUT);
    digitalWrite(debugLedPin, LOW);
    
    servo.attach(servoPin);

    Serial.begin(SERIAL_BAUDRATE);
    Serial.println();
    

    wifiSetup();

    serverSetup();


    fauxmo.createServer(false);
    fauxmo.setPort(80); // This is required for gen3 devices

    fauxmo.enable(false);
    fauxmo.enable(true);

    fauxmo.addDevice("air conditioner");
    fauxmo.addDevice("television");
    fauxmo.addDevice("fan");
    
    fauxmo.onSetState([](unsigned char device_id, const char * device_name, bool state, unsigned char value) {
        
        // Callback when a command from Alexa is received. 
        
        Serial.printf("[MAIN] Device #%d (%s) state: %s value: %d\n", device_id, device_name, state ? "ON" : "OFF", value);

        if (strcmp(device_name, "air conditioner") == 0) {
          ac_helper();
        } else if (strcmp(device_name, "television") == 0) {
          tv_helper();
        } else if (strcmp(device_name, "fan") == 0) {
          state ? digitalWrite(fanRelayPin, HIGH) : digitalWrite(fanRelayPin, LOW);
        }

    });


}

void loop() {

    timer.run();
    fauxmo.handle();

    // This is a sample code to output free heap every 5 seconds
    // This is a cheap way to detect memory leaks
    static unsigned long last = millis();
    if (millis() - last > 5000) {
        last = millis();
        Serial.printf("[MAIN] Free heap: %d bytes\n", ESP.getFreeHeap());
    }

}
