#!/bin/bash

python3 - <<END
import os
from datetime import datetime

# Get current timestamp
timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

# Create file with timestamp in filename
filename = f"file_{timestamp}.txt"
open(filename, 'a').close()
print(f"File '{filename}' created.")
END