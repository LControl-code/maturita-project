import random
from pocketbase import PocketBase
from pocketbase.client import FileUpload
from datetime import datetime
import string
import time
import sys
import select

client = PocketBase('http://127.0.0.1:8090')

# or as admin
admin_data = client.admins.auth_with_password("adam.stratilik@student.ssnd.sk", "Ne$((allA*")

# check if admin token is valid
admin_data.is_valid

# Define the limits for the random values
limits = {
  "Offset_WR_UV_Res": (-0.1, 0.1),
  "Offset_WR_VW_Res": (-0.1, 0.1),
  "Offset_WR_WU_Res": (-0.1, 0.1),
  "Un_UV": (0, 5),
  "Un_VW": (0, 5),
  "Un_WU": (0, 5),
  "Surge_U_VW_AreaDiff": (-2.5, 2.5),
  "Surge_V_WU_AreaDiff": (-2.5, 2.5),
  "Surge_W_UV_AreaDiff": (-2.5, 2.5),
  "Surge_U_VW_DiffArea": (-2.5, 2.5),
  "Surge_V_WU_DiffArea": (-2.5, 2.5),
  "Surge_W_UV_DiffArea": (-2.5, 2.5),
  "Surge_U_VW_L_Vale": (-20, 20),
  "Surge_V_WU_L_Vale": (-20, 20),
  "Surge_W_UV_L_Vale": (-20, 20),
  "IR_1_UVW_G_NTC": (1, 50),
  "IR_2_NTC_G": (1, 50),
  "HiPot_1_UVW_G_NTC": (0, 1),
  "HiPot_2_NTC_G": (0, 1),
  "NTC1_Res": (0, 10),
  "NTC2_Res": (0, 10),
}

while True:
  # Randomly select a motor type
  motor_type = random.choice(["EFAD", "ERAD", "Short"])

  # Generate random values within the provided limits
  entry_data = {
    "time": datetime.now().isoformat(),
    "device_code": ''.join(random.choices(string.ascii_uppercase + string.digits, k=10)),
    "motor_type": motor_type,
  }

  # Determine test_fail status based on 70/30 probability
  test_fail = random.random() < 0.3

  # Add random values for each field
  for key, (low, high) in limits.items():
    if test_fail:
      # 30% chance to generate a value outside the limits
      if random.choice([True, False]):
        entry_data[key] = round(random.uniform(low - 1, low - 0.1), 2)  # Below the lower limit
      else:
        entry_data[key] = round(random.uniform(high + 0.1, high + 1), 2)  # Above the upper limit
    else:
      # 70% chance to generate a value within the limits
      entry_data[key] = round(random.uniform(low, high), 2)

  # Set the test_fail field based on the generated values
  entry_data["test_fail"] = "true" if test_fail else "false"

  # Create the new entry in PocketBase
  try:
    result = client.collection("station_s02").create(entry_data)
  except Exception as e:
    print(f"Error: {e}")
    print(f"Entry data: {entry_data}")
  else:
    # Print the time, device code, and test fail to the console
    print(f"time: {entry_data['time']}, device_code: {entry_data['device_code']}, test_fail: {entry_data['test_fail']}")

  # Sleep for a random duration between 1.5 and 3 minutes
  sleep_duration = round(random.uniform(90, 180), 2)
  print(f"Sleeping for {sleep_duration} seconds (press Enter to skip)", end="\r")
  
  start_time = time.time()
  while time.time() - start_time < sleep_duration:
    if sys.stdin in select.select([sys.stdin], [], [], 1)[0]:
      input()  # Clear the input buffer
      break
    time.sleep(1)