#!/bin/bash
pin19=$(gpio -g read 19)
pin26=$(gpio -g read 26)
gpio -g write 26 $pin19
gpio -g write 19 $pin26
