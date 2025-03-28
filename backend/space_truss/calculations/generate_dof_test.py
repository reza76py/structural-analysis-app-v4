import sys
import os

# ✅ Add root path dynamically (up 3 levels from this file)
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# ✅ Now imports work correctly
from space_truss.calculations.generate_dof_indices import generate_dof_indices

# === Test your function ===
start = "0,0,0"
end = "6,24,-8"

dof_indices = generate_dof_indices(start, end)
print("DOF Indices:", dof_indices)
