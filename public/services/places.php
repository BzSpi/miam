<?php

include(__DIR__.'/../../lib/libs.php');

$pm = new PlaceManager();
$places = $pm->listPlaces();

echo json_encode(array_map(function($p) { return $p->toSerializableObject(); }, $places));
