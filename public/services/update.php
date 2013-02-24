<?php

require_once(__DIR__.'/../../lib/libs.php');

$postdata = file_get_contents("php://input");

if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($postdata))
{
  $p = Place::parseJson($postdata);
  $p->save();

  echo json_encode($p->toSerializableObject());
}
