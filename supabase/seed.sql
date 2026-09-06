insert into crops (name, msp_rate) values
  ('Wheat', 2274.00), ('Mustard', 5650.00), ('Barley', 1850.00), ('Gram', 5440.00)
on conflict (name) do nothing;

insert into procurement_centres (id, name, address, village, district, state, latitude, longitude, daily_capacity, status)
values
  ('11111111-1111-1111-1111-111111111111', 'Shakti Agro Procurement Centre', 'NH-19, Bichpuri Road', 'Bichpuri', 'Agra', 'Uttar Pradesh', 27.1591, 77.9436, 220, 'OPEN'),
  ('22222222-2222-2222-2222-222222222222', 'Kisan Seva Procurement Centre', 'Etmadpur Mandi Yard', 'Etmadpur', 'Agra', 'Uttar Pradesh', 27.1975, 78.1145, 180, 'HIGH_RUSH'),
  ('33333333-3333-3333-3333-333333333333', 'GreenField Procurement Centre', 'Fatehabad Road', 'Fatehabad', 'Agra', 'Uttar Pradesh', 27.0704, 78.2245, 150, 'LIMITED_CAPACITY')
on conflict (id) do nothing;


insert into slots (centre_id, slot_date, start_time, end_time, capacity, booked_count)
select c.id, current_date, t.start_time, t.start_time + interval '1 hour', 20, floor(random() * 15)
from procurement_centres c
cross join (
  values ('09:00'::time), ('10:00'::time), ('11:00'::time), ('12:00'::time), ('13:00'::time), ('14:00'::time)
) as t(start_time)
on conflict (centre_id, slot_date, start_time) do nothing;


