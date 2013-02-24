<?php

/**
 * Object representing a Place
 *
 * @author Spi
 */
class Place
{
  protected $id, $name, $description, $placeTypeId, $type, $link, $lat, $lng;

  public function __construct() {}

  /**
   * @see http://www.php.net/manual/en/language.oop5.overloading.php#object.get
   * @param string $name
   * @return mixed
   */
  public function __get($name)
  {
    return $this->$name;
  }

  /**
   * @see http://www.php.net/manual/en/language.oop5.overloading.php#object.get
   * @param string $name
   * @param mixed $value
   */
  public function __set($name, $value)
  {
    $this->$name = $value;
    switch ($name)
    {
      case 'placeTypeId':
        $this->updatePlaceType();
        break;
    }
  }

  /**
   * Updates the inner type object if necessary
   */
  protected function updatePlaceType()
  {
    if((empty($this->type) && !empty($this->placeTypeId)) ||
       (!empty($this->type) && !empty($this->placeTypeId) && $this->placeTypeId !== $this->type->id))
    {
        $pm = new PlaceManager();
        $this->type = $pm->getPlaceType($this->placeTypeId);
    }
    else if(empty($this->placeTypeId))
    {
      $this->type = null;
    }
  }

  /**
   * Saves the object in the database
   */
  public function save()
  {
    $pm = new PlaceManager();
    if(empty($this->id))
      $pm->addPlace($this);
    else
      $pm->updatePlace($this);
  }

  /**
   * Creates a serializable anonymous obecjt with all properties
   *
   * @return object the the serializable obecjt
   */
  public function toSerializableObject()
  {
    return (object) array(
      'id'          => $this->id,
      'name'        => $this->name,
      'description' => $this->description,
      'link'        => $this->link,
      'lat'         => $this->lat,
      'lng'         => $this->lng,
      'placeTypeId' => $this->placeTypeId,
      'type'        => isset($this->type) ? $this->type->toSerializableObject() : null
    );
  }

  /**
   * Parses a json string a construct a Place object with
   *
   * @param string $json the json string to parse
   * @return \Place the object consrtucted from the json string
   */
  public static function parseJson($json)
  {
    $datas = json_decode($json);
    $p = new Place();
    if(isset($datas->id))
      $p->id = $datas->id;
    if(isset($datas->name))
      $p->name = $datas->name;
    if(isset($datas->description))
      $p->description = $datas->description;
    if(isset($datas->link))
      $p->link = $datas->link;
    if(isset($datas->placeTypeId))
      $p->placeTypeId = $datas->placeTypeId;
    if(isset($datas->lat))
      $p->lat = $datas->lat;
    if(isset($datas->lng))
      $p->lng = $datas->lng;
    $p->updatePlaceType();
    return $p;
  }
}
