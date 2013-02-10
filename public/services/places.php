<?php

include(__DIR__.'/../../lib/libs.php');

$places = array(
  (object) array(
    'id'  => 1,
    'name' => 'Houblon & Sarazin',
    'description' => 'C\'est la crêperie',
    'type' => PlaceTypeEnum::RESTAURANT,
    'link' => '',
    'lat' => 48.869316,
    'lng' => 2.356610
  ),
  (object) array(
    'id'  => 2,
    'name' => 'Les fils du soleil',
    'description' => 'C\'est le mexicain qui est en fait un colombien',
    'type' => PlaceTypeEnum::MEXICAN,
    'link' => '',
    'lat' => 48.869076,
    'lng' => 2.358198
  ),
  (object) array(
    'id'  => 3,
    'name' => 'Renaissance',
    'description' => 'Une brasserie sympathique',
    'type' => PlaceTypeEnum::BRASSERIE,
    'link' => '',
    'lat' => 48.869182,
    'lng' => 2.356095
  ),
  (object) array(
    'id'  => 4,
    'name' => 'Pause croissant',
    'description' => 'Le salad bar',
    'type' => PlaceTypeEnum::FASTFOOD,
    'link' => '',
    'lat'  => 48.868371,
    'lng'  => 2.359968
  ),
  (object) array(
    'id'  => 5,
    'name' => 'Mc Donald\'s',
    'description' => 'McDo pour les intimes',
    'type' => PlaceTypeEnum::FASTFOOD,
    'link' => 'http://www.mcdonalds.fr/',
    'lat' => 48.867721,
    'lng' => 2.362543
  ),
  (object) array(
    'id'  => 6,
    'name' => 'Le vernissoir',
    'description' => 'On mange bien',
    'type' => PlaceTypeEnum::GOURMET,
    'link' => '',
    'lat' => 48.866790,
    'lng' => 2.359110
  ),
);

echo json_encode($places);
