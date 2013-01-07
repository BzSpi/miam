<?php

include(__DIR__.'/../lib/libs.php');

$typeClass = new ReflectionClass('PlaceTypeEnum');
$types = array();
foreach($typeClass->getConstants() as $cst)
{
  $types[] = (object) array(
    'identifier' => $cst,
    'name'       => $cst
  );
}

echo json_encode(array_values($types));