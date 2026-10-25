-- ============================================================
-- V2: Seed all 18 skill categories
-- ============================================================

INSERT INTO skill_categories (name, description, icon_name) VALUES
    ('Painter',                 'Interior and exterior painting services',           'paintbrush'),
    ('Carpenter',               'Woodwork, furniture repair, and carpentry',          'hammer'),
    ('Plumber',                 'Pipe fitting, leak repair, and drainage work',       'wrench'),
    ('Electrician',             'Electrical wiring, repair, and installation',        'zap'),
    ('Mason',                   'Brickwork, plastering, and masonry construction',    'brick-wall'),
    ('Welder',                  'Metal welding and fabrication',                      'flame'),
    ('AC/Appliance Repair Technician', 'AC servicing, fridge, washing machine repair', 'thermometer'),
    ('Pest Control Worker',     'Termite, rodent, and pest extermination',            'bug'),
    ('Gardener/Landscaper',     'Garden maintenance, landscaping, and lawn care',     'flower-2'),
    ('House Cleaner/Housekeeping', 'Home cleaning, deep cleaning, and sanitisation', 'sparkles'),
    ('Movers/Loaders',          'Packing, loading, and moving services',             'truck'),
    ('Tile/Flooring Worker',    'Tile laying, flooring installation and repair',      'grid-3x3'),
    ('Roofer',                  'Roof repair, waterproofing, and installation',       'home'),
    ('Glass/Window Fitter',     'Glass cutting, window fitting, and mirror work',     'panel-top'),
    ('CCTV/Electronics Installer', 'CCTV, intercom, and electronics installation',  'camera'),
    ('Driver',                  'Personal, commercial, and delivery driving',         'car'),
    ('Cook/Catering Help',      'Cooking, catering, and food preparation',            'chef-hat'),
    ('Security Guard',          'Property and event security services',               'shield');
