from pocketbase import PocketBase

from pocketbase.client import FileUpload

from datetime import datetime, timedelta
import random
import string
import time
import sys
import select

pb = PocketBase('http://127.0.0.1:8090', "adam.stratilik@student.ssnd.sk", "hbhn25ws*1")

# Define the limits for each station and motor type
station_limits = {
  "A20": {
    "EFAD": {
      "NTC1_Res": (12, 5),
      "HiPot_1_UVW_G_NTC": (10, 3),
      "HiPot_2_NTC_G": (10, 0.02),
      "IR_1_UVW_G_NTC": (550, 10),
      "IR_2_NTC_G": (550, 30),
      "Surge_U_VW_L_Vale": (12, 0),
      "Surge_V_WU_L_Vale": (12, 0),
      "Surge_W_UV_L_Vale": (12, 0),
      "Offset_NTC1_Res": (12.481, 8.07),
      "Offset_NTC1_Temp": (30, 2),
      "Offset_NTC2_Res": (12.481, 8.07),
      "Offset_NTC2_Temp": (30, 2)
    },
    "ERAD": {
      "NTC1_Res": (12, 5),
      "HiPot_1_UVW_G_NTC": (12, 3),
      "HiPot_2_NTC_G": (12, 0.02),
      "IR_1_UVW_G_NTC": (550, 10),
      "IR_2_NTC_G": (550, 30),
      "Surge_U_VW_L_Vale": (12, 0),
      "Surge_V_WU_L_Vale": (12, 0),
      "Surge_W_UV_L_Vale": (12, 0),
      "Offset_NTC1_Res": (12.481, 8.07),
      "Offset_NTC1_Temp": (30, 2),
      "Offset_NTC2_Res": (12.481, 8.07),
      "Offset_NTC2_Temp": (30, 2)
    },
  },
  "A25": {
    "EFAD": {
      "Offset_NTC1_Res": (12.481, 8.07),
      "Offset_NTC1_Temp": (30, 2),
      "Offset_NTC2_Res": (12.481, 8.07),
      "Offset_NTC2_Temp": (30, 2),
      "Offset_Cos__and_Cos": (31.08, 28.12),
      "Offset_Sin__and_Sin": (28.35, 25.65),
      "Offset_Exc__and_Exc": (14.49, 13.11),
      "Cos__and_Sin_": (10000, 0),
      "Sin__and_Exc_": (10000, 0),
      "Cos_and_Sin": (10000, 0),
      "Sin_and_Exc": (10000, 0),
      "Offset_PCBA_Ground": (0.7, 0)
    },
    "ERAD": {
      "Offset_NTC1_Res": (12.481, 8.07),
      "Offset_NTC1_Temp": (30, 2),
      "Offset_NTC2_Res": (12.481, 8.07),
      "Offset_NTC2_Temp": (30, 2),
      "Offset_Cos__and_Cos": (31.08, 28.12),
      "Offset_Sin__and_Sin": (28.35, 25.65),
      "Offset_Exc__and_Exc": (14.49, 13.11),
      "Cos__and_Sin_": (10000, 0),
      "Sin__and_Exc_": (10000, 0),
      "Cos_and_Sin": (10000, 0),
      "Sin_and_Exc": (10000, 0),
      "Offset_PCBA_Ground": (0.7, 0)
    },
    "Short": {
      "Offset_NTC1_Res": (12.481, 8.07),
      "Offset_NTC1_Temp": (30, 2),
      "Offset_NTC2_Res": (12.481, 8.07),
      "Offset_NTC2_Temp": (30, 2),
      "Offset_Cos__and_Cos": (31.08, 28.12),
      "Offset_Sin__and_Sin": (28.35, 25.65),
      "Offset_Exc__and_Exc": (14.49, 13.11),
      "Cos__and_Sin_": (10000, 0),
      "Sin__and_Exc_": (10000, 0),
      "Cos_and_Sin": (10000, 0),
      "Sin_and_Exc": (10000, 0),
      "Offset_PCBA_Ground": (0.7, 0)
    }
  },
  "A26": {
    "EFAD": {
      "Lineraity": (1, -1),
      "OffsetAngle": (-28, -68),
      "PhaseSequence": (1, 0.1),
      "NTC1_Res": (18.052, 5.801),
      # "NTC1_Temp": None,
      # "TempCoefficient": None,
      "Offset_UV_Vpeak": (48.7911, 45.9489),
      "Offset_VW_Vpeak": (48.7911, 45.9489),
      "Offset_WU_Vpeak": (48.7911, 45.9489),
      "Un_UV": (1, -1),
      "Un_VW": (1, -1),
      "Un_WU": (1, -1),
      "THD": (1.5, 0.1),
      # "RPM": None
    },
    "ERAD": {
      "Lineraity": (1, -1),
      "OffsetAngle": (188, 148),
      "PhaseSequence": (1, 0.1),
      "NTC1_Res": (18.052, 5.801),
      # "NTC1_Temp": None,
      # "TempCoefficient": None,
      "Offset_UV_Vpeak": (57.989, 54.611),
      "Offset_VW_Vpeak": (57.989, 54.611),
      "Offset_WU_Vpeak": (57.989, 54.611),
      "Un_UV": (1, -1),
      "Un_VW": (1, -1),
      "Un_WU": (1, -1),
      "THD": (1.5, 0.1),
      # "RPM": None
    },
    "Short": {
      "Lineraity": (1, -1),
      "OffsetAngle": (188, 148),
      "PhaseSequence": (1, 0.1),
      "NTC1_Res": (18.052, 5.801),
      # "NTC1_Temp": None,
      # "TempCoefficient": None,
      "Offset_UV_Vpeak": (48.7911, 45.9489),
      "Offset_VW_Vpeak": (48.7911, 45.9489),
      "Offset_WU_Vpeak": (48.7911, 45.9489),
      "Un_UV": (1, -1),
      "Un_VW": (1, -1),
      "Un_WU": (1, -1),
      "THD": (1.5, 0.1),
      # "RPM": None
    }
  },
  "S02": {
    "EFAD": {
      "NTC1_Res": (18.052, 8.07),
      # "NTC1_Temp": None,
      "NTC2_Res": (18.052, 8.07),
      # "NTC2_Temp": None,
      # "WR_UV_Res": None,
      # "WR_VW_Res": None,
      # "WR_WU_Res": None,
      "Offset_WR_UV_Res": (14.42, 13.58),
      "Offset_WR_VW_Res": (14.42, 13.58),
      "Offset_WR_WU_Res": (14.42, 13.58),
      "Un_UV": (1, -1),
      "Un_VW": (1, -1),
      "Un_WU": (1, -1),
      "Surge_U_VW_AreaDiff": (5, -5),
      "Surge_V_WU_AreaDiff": (5, -5),
      "Surge_W_UV_AreaDiff": (5, -5),
      "Surge_U_VW_DiffArea": (15, 0),
      "Surge_V_WU_DiffArea": (15, 0),
      "Surge_W_UV_DiffArea": (15, 0),
      "Surge_U_VW_L_Vale": (12, 0),
      "Surge_V_WU_L_Vale": (12, 0),
      "Surge_W_UV_L_Vale": (12, 0),
      "IR_1_UVW_G_NTC": (550, 20),
      "IR_2_NTC_G": (550, 50),
      "HiPot_1_UVW_G_NTC": (7.3, 3),
      "HiPot_2_NTC_G": (10, 0.02)
    },
    "ERAD": {
      "NTC1_Res": (18.052, 8.07),
      # "NTC1_Temp": None,
      "NTC2_Res": (18.052, 8.07),
      # "NTC2_Temp": None,
      # "WR_UV_Res": None,
      # "WR_VW_Res": None,
      # "WR_WU_Res": None,
      "Offset_WR_UV_Res": (13.699, 12.901),
      "Offset_WR_VW_Res": (13.699, 12.901),
      "Offset_WR_WU_Res": (13.699, 12.901),
      "Un_UV": (1, -1),
      "Un_VW": (1, -1),
      "Un_WU": (1, -1),
      "Surge_U_VW_AreaDiff": (5, -5),
      "Surge_V_WU_AreaDiff": (5, -5),
      "Surge_W_UV_AreaDiff": (5, -5),
      "Surge_U_VW_DiffArea": (15, 0),
      "Surge_V_WU_DiffArea": (15, 0),
      "Surge_W_UV_DiffArea": (15, 0),
      "Surge_U_VW_L_Vale": (12, 0),
      "Surge_V_WU_L_Vale": (12, 0),
      "Surge_W_UV_L_Vale": (12, 0),
      "IR_1_UVW_G_NTC": (550, 20),
      "IR_2_NTC_G": (550, 50),
      "HiPot_1_UVW_G_NTC": (9, 3),
      "HiPot_2_NTC_G": (12, 0.02)
    },
  },
  "NVH": {
    "EFAD": {
      "Vibration": (1, 1),
      "No_Load_Current": (9, 1),
      "DC_bus": (1000, 1),
      "Out_Voltage": (1000, 1),
      "Out_PowerkW": (1000, 1),
      "Up_side_Air": (0.8, 0.3),
      "Acc_1_Air": (0.8, 0.3),
      "Acc_2_Air": (0.8, 0.3),
      "Acc_3_Air": (0.8, 0.3),
    },
    "ERAD": {
      "Vibration": (1, 1),
      "No_Load_Current": (9, 1),
      "DC_bus": (1000, 1),
      "Out_Voltage": (1000, 1),
      "Out_PowerkW": (1000, 1),
      "Up_side_Air": (0.8, 0.3),
      "Acc_1_Air": (0.8, 0.3),
      "Acc_2_Air": (0.8, 0.3),
      "Acc_3_Air": (0.8, 0.3),
    },
    "Short": {
      "Vibration": (1, 1),
      "No_Load_Current": (9, 1),
      "DC_bus": (1000, 1),
      "Out_Voltage": (1000, 1),
      "Out_PowerkW": (1000, 1),
      "Up_side_Air": (0.8, 0.3),
      "Acc_1_Air": (0.8, 0.3),
      "Acc_2_Air": (0.8, 0.3),
      "Acc_3_Air": (0.8, 0.3),
    }
  },
  "R23": {
    "EFAD": {
      "L12": (1.75, 0.75),
      "L13": (3.125, 1.875),
      "L14": (4.375, 3.125),
      "L15": (5.8, 4.2),
      "L16": (7.05, 5.45),
      "Start_Temp": (40, 10),
      "Finish_Temp": (40, 10),
      # "TempCoefficient": None,
      "Offset_UV_Vpeak": (37.389, 35.211),
      "Offset_VW_Vpeak": (37.389, 35.211),
      "Offset_WU_Vpeak": (37.389, 35.211),
      "THD": (1.5, 0.1),
      "L12_1": (1.75, 0.75),
      "L23": (1.75, 0.75),
      "L34": (1.75, 0.75),
      "L45": (1.75, 0.75),
      "L56": (1.75, 0.75),
      "Origin_UV_Vpeak": (42.848, 40.352),
      "Origin_VW_Vpeak": (42.848, 40.352),
      "Origin_WU_Vpeak": (42.848, 40.352),
      "Un_UV": (1, -1),
      "Un_VW": (1, -1),
      "Un_WU": (1, -1),
      # "THD_UV": None,
      # "THD_VW": None,
      # "THD_WU": None,
      # "RPM": None
    },
    "ERAD": {
      "L12": (1.75, 0.75),
      "L13": (3.125, 1.875),
      "L14": (4.375, 3.125),
      "L15": (5.8, 4.2),
      "L16": (7.05, 5.45),
      "Start_Temp": (40, 10),
      "Finish_Temp": (40, 10),
      # "TempCoefficient": None,
      "Offset_UV_Vpeak": (37.389, 35.211),
      "Offset_VW_Vpeak": (37.389, 35.211),
      "Offset_WU_Vpeak": (37.389, 35.211),
      "THD": (1.5, 0.1),
      "L12_1": (1.75, 0.75),
      "L23": (1.75, 0.75),
      "L34": (1.75, 0.75),
      "L45": (1.75, 0.75),
      "L56": (1.75, 0.75),
      "Origin_UV_Vpeak": (42.848, 40.352),
      "Origin_VW_Vpeak": (42.848, 40.352),
      "Origin_WU_Vpeak": (42.848, 40.352),
      "Un_UV": (1, -1),
      "Un_VW": (1, -1),
      "Un_WU": (1, -1),
      # "THD_UV": None,
      # "THD_VW": None,
      # "THD_WU": None,
      # "RPM": None
    },
  }
}

while True:
    # Iterate over each station
    motor_type = random.choice(["EFAD", "ERAD", "Short"])
    motor_type = "EFAD"
    device_code = f"P{random.randint(10000000, 99999999)}#1TF{random.randint(10000000, 99999999)}#{''.join(random.choices(string.ascii_uppercase, k=6))}#"
    i = 0  # Initialize the counter
    for station in station_limits.keys():
      test_fail = random.random() < 0.3 # 7% chance of test failure
      # Generate random values within the provided limits
      entry_data = {
        "time": (datetime.now() + timedelta(minutes=i*2)).isoformat(),
        "device_code": device_code,
        "motor_type": motor_type,
      }

      # Get the limits for the current station and motor type
      limits = station_limits[station][motor_type]

      # Add random values for each field
      if test_fail:
        # Randomly select tests to fail
        num_fail_tests = random.randint(1, len(limits) - 5)
        
        fail_tests = random.sample(list(limits.keys()), num_fail_tests)

        for key, (high, low) in limits.items():
          if key in fail_tests:
            # Generate a value outside the limits
            if random.choice([True, False]):
              entry_data[key] = round(random.uniform(low - 1, low - 0.1), 3)  # Below the lower limit
            else:
              entry_data[key] = round(random.uniform(high + 0.1, high + 1), 3)  # Above the upper limit
          else:
            # Generate a value within the limits
            entry_data[key] = round(random.uniform(low, high), 3)
      else:
        for key, (high, low) in limits.items():
          # Generate a value within the limits
          entry_data[key] = round(random.uniform(low, high), 3)

      # Set the test_fail field based on the generated values
      entry_data["test_fail"] = "true" if test_fail else "false"

      # Create the new entry in PocketBase
      try:
        collection_name = f"station_{station.lower()}"
        created_record = pb.create_record(collection_name, entry_data)
      except Exception as e:
        print(f"Error: {e}")
        print(f"Entry data: {entry_data}")
      else:
        # Print the time, device code, and test fail to the console
        print(f"time: {entry_data['time']}, device_code: {entry_data['device_code']}, test_fail: {entry_data['test_fail']}")

      i += 1  # Increment the counter

    # Sleep for a random duration between 1.5 and 3 minutes
    sleep_duration = round(random.uniform(90, 180), 2)
    print(f"Sleeping for {sleep_duration} seconds (press Enter to skip)", end="\r")

    start_time = time.time()
    while time.time() - start_time < sleep_duration:
      if sys.stdin in select.select([sys.stdin], [], [], 1)[0]:
        input()  # Clear the input buffer
        break
      time.sleep(1)














# # Create limit records for each collection
# for station, motor_types in station_limits.items():
#     if station == "S02":
#         continue

#     collection_name = f"station_{station.lower()}_limits"

#     for motor_type, tests in motor_types.items():
#         entry_data = {"motor_type": motor_type}
#         for test_name, (max_val, min_val) in tests.items():
#             entry_data[f"{test_name}_MIN"] = min_val
#             entry_data[f"{test_name}_MAX"] = max_val

#         try:
#             created_record = pb.create_record(collection_name, entry_data)
#             print(f"Record for motor type '{motor_type}' in collection '{collection_name}' created successfully.")
#         except Exception as e:
#             print(f"Error creating record for motor type '{motor_type}' in collection '{collection_name}': {e}")


# # Create collections for each station except S02
# for station, motor_types in station_limits.items():
#     if station not in ["A25"]:
#         continue

#     collection_name = f"station_{station.lower()}_limits"
#     db_type = 'base'
#     schema = []

#     # Add fields for each test limit for EFAD motor type only
#     for test_name in motor_types["EFAD"].keys():
#         schema.append({
#             'name': f'{test_name}_MIN', 
#             'type': 'number', 
#             'required': False
#         })
#         schema.append({
#             'name': f'{test_name}_MAX', 
#             'type': 'number', 
#             'required': False
#         })
#     try:
#         pb.create_collection(collection_name, db_type, schema, fields="")
#         print(f"Collection '{collection_name}' created successfully.")
#     except Exception as e:
#         print(f"Error creating collection '{collection_name}': {e}")

