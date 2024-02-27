import netCDF4 as nc

filepath = "D:\\1study\\Work\\2023_12_22_Storm\\Data\\20230831\\fort.63_nowind.nc"
# filepath = "D:\\1study\\Work\\2023_12_22_Storm\\Data\\20230831\\adcirc_addwind.nc"
ncfile = nc.Dataset(filepath,"r",format='NETCDF3_CLASSIC')
zeta = ncfile["zeta"][:]
city = zeta[:,27262]

print(ncfile)