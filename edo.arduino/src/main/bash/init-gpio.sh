#!/bin/bash
gpio export 26 out
gpio export 19 out
gpio -g write 26 0
gpio -g write 19 1
