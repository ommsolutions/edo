// digital pin 12 has a Relay attached to it (for opening the door)
int outputPin = 12;
// most Arduinos have a LED Pin builtin
int ledPin = 13;

// Input-Pins for reading the OPEN-Signal from RPi
int inputPin1 = 4;
int inputPin2 = 7;

int statePin1 = 2;
int statePin2 = 2;

// close the circuit of the door via the Relais for X milliseconds
long openingDelay = 1500;


void setup() {
  pinMode(outputPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(outputPin, HIGH);
  digitalWrite(ledPin, LOW);

  pinMode(inputPin1, INPUT);
  pinMode(inputPin2, INPUT);
}

void loop() {
  int statePin1New = digitalRead(inputPin1);
  int statePin2New = digitalRead(inputPin2);

  // Check if pin1 != pin2 AND if the pin values changed since last loop iteration
  if (statePin1New != statePin2New && (statePin1New != statePin1 && statePin2New != statePin2)) {
    // initial value is 2
    if (statePin1 == 2 && statePin2 == 2) {
      // --> First run (init GPIO on RPi, don't open)
      statePin1 = statePin1New;
      statePin2 = statePin2New;
    } else {
      // Open via Relay
      digitalWrite(outputPin, LOW);
      // Blink LED on Board (just Debug)
      digitalWrite(ledPin, HIGH);
      // Wait while door buzzes
      delay(openingDelay);
      // Close the circuit
      digitalWrite(outputPin, HIGH);
      // Turn the light off
      digitalWrite(ledPin, LOW);
      // Keep the state of the pins for the next loop iteration
      statePin1 = statePin1New;
      statePin2 = statePin2New;
    }
    // Wait another 2s just to make it more stable
      delay(2000);
  } else {
    delay(50);
  }
  delay(1);
}
