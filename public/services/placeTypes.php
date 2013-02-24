<?php

include(__DIR__.'/../../lib/libs.php');

$pm = new PlaceManager();
$types = $pm->listPlaceTypes();

echo json_encode(array_map(function($t) { return $t->toSerializableObject(); }, $types));
