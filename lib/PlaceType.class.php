<?php

/**
 * Object representing a place type
 *
 * @author Spi
 */
class PlaceType
{
  protected $id, $label, $name;

  public function __construct() {}

  /**
   * @see http://www.php.net/manual/en/language.oop5.overloading.php#object.get
   * @param string $name
   * @param mixed $value
   */
  public function __set($name, $value)
  {
    $this->$name = $value;
  }

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
   * Creates a serializable anonymous obecjt with all properties
   *
   * @return object the the serializable obecjt
   */
  public function toSerializableObject()
  {
    return (object) array(
      'id' => $this->id,
      'label' => $this->label,
      'name' => $this->name
    );
  }
}
