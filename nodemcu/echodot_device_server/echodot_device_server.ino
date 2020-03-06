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

#include <Servo.h>

#include <SimpleTimer.h>

SimpleTimer timer;

Servo servo;
const uint16_t servoPin = 14; //D5
const uint16_t ac_pos = 50;
const uint16_t tv_pos = 160;
const uint16_t servo_delay = 4000;

const uint16_t kIrLed = 4;  // ESP8266 GPIO pin to use. Recommended: 4 (D2).
IRsend irsend(kIrLed);  // Set the GPIO to be used to sending the message.

const uint16_t fanRelayPin = 16; // D0

const uint16_t debugLedPin = 5; //D1
bool debugLedState = false;

bool webRequest = false;

#include "credentials.h"
#include "myir_raw.h"

fauxmoESP fauxmo;
AsyncWebServer server(80);
StaticJsonDocument<200> doc;

String debug;


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
  digitalWrite(debugLedPin, debugLedState);
}

void ac_helper() {
  servo.write(ac_pos);
  debugLedState = !debugLedState;
  //irsend.sendRaw(AC_PWR, AC_LEN, IR_FREQ);
  timer.setTimeout(1000, ac_remote);
}

void tv_remote() {
  irsend.sendRaw(TV_PWR, TV_LEN, IR_FREQ);
  digitalWrite(debugLedPin, debugLedState);
}

void tv_helper() {  
  servo.write(tv_pos);
  debugLedState = !debugLedState;
  timer.setTimeout(1000, tv_remote);
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

    server.on("/ac", HTTP_GET, [](AsyncWebServerRequest *request) {
      ac_helper();
      request->send(200, "text/plain", String(random(1000)));
    });

    server.on("/tv", HTTP_GET, [](AsyncWebServerRequest *request) {
      tv_helper();
      request->send(200, "text/plain", String(random(1000)));
    });

    server.begin();

}

void processWebRequest() {
  
}

void setup() {

    irsend.begin();

    pinMode(fanRelayPin, OUTPUT);
    digitalWrite(fanRelayPin, LOW);

    pinMode(debugLedPin, OUTPUT);
    digitalWrite(debugLedPin, LOW);
    
    servo.attach(servoPin);
    //servo.write(0);

    Serial.begin(SERIAL_BAUDRATE);
    Serial.println();
    Serial.println();

    wifiSetup();
    debug += "Connected\n";

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
        debug += "\ndevice id: " + String(device_id) + " device_name: "+ device_name + " state: "+ String(state); 

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
