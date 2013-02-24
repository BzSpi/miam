<?php

require_once(__DIR__.'/Place.class.php');
require_once(__DIR__.'/dal/DatabaseFactory.class.php');

/**
 * Manages the databases objects
 *
 * @author Spi
 */
class PlaceManager
{
  protected $db;

  public function __construct()
  {
    $this->db = DatabaseFactory::getDatabase();
  }

  /**
   * Adds a place in the database
   *
   * @param Place $p the place to add
   */
  public function addPlace(Place $p)
  {
    $q = 'INSERT INTO place (name, description, place_type_id, link, lat, lng) VALUES(\'%s\', \'%s\', %s, \'%s\', %s, %s)';
    $q = sprintf($q, $p->name, $p->description, $p->placeTypeId, $p->link, $p->lat, $p->lng);
    $p->id = $this->db->insert($q);
  }

  /**
   * Updates a place in the database
   *
   * @param Place $p the place with its new properties
   */
  public function updatePlace(Place $p)
  {
    $q = 'UPDATE place SET name=\'%s\', description=\'%s\', place_type_id=%s, link=\'%s\', lat=%s, lng=%s WHERE id=%s';
    $q = sprintf($q, $p->name, $p->description, $p->placeTypeId, $p->link, $p->lat, $p->lng, $p->id);
    $this->db->update($q);
  }

  /**
   * List all the places in the database
   *
   * @return array Array of the places in the database
   */
  public function listPlaces()
  {
    $q = 'SELECT place.*, pt.label AS place_type_label, pt.name AS place_type_name FROM place INNER JOIN place_type pt ON place.place_type_id=pt.id';
    $it = $this->db->select($q);
    $ret = array();
    while($it->hasNext())
    {
      $ret[] = $this->hydratePlace($it->next());
    }
    return $ret;
  }

  /**
   * Retrieve a place from the database with its id
   *
   * @param int $id the id of the place to retrieve
   * @return Place the place associated with the given id
   */
  public function getPlace($id)
  {
    $q = sprintf('SELECT * FROM place WHERE id=%s LIMIT 0,1', $id);
    $it = $this->db->select($q);
    $ret = null;
    if($it->hasNext())
    {
      $ret = $this->hydratePlace($it->next());
    }
    return $ret;
  }

  /**
   * Retrieve a place type from the database with its id
   *
   * @param int $id the id of the place type to retrieve
   * @return PlaceType the place type associated with the given id
   */
  public function getPlaceType($id)
  {
    $q = sprintf('SELECT * FROM place_type WHERE id=%s LIMIT 0,1', $id);
    $it = $this->db->select($q);
    $ret = null;
    if($it->hasNext())
    {
      $ret = $this->hydratePlaceType($it->next());
    }
    return $ret;
  }

  /**
   * List all the place types in the database
   *
   * @return array Array of the place types in the database
   */
  public function listPlaceTypes()
  {
    $q = 'SELECT * FROM place_type';
    $it = $this->db->select($q);
    $ret = array();
    while($it->hasNext())
    {
      $ret[] = $this->hydratePlaceType($it->next());
    }
    return $ret;
  }

  /**
   * List the associated place types in the database
   *
   * @return array Array of the associated place types in the database
   */
  public function listUsedPlaceTypes()
  {
    $q = 'SELECT pt.* FROM place_type pt INNER JOIN place p ON p.place_type_id=pt.id';
    $it = $this->db->select($q);
    $ret = array();
    while($it->hasNext())
    {
      $ret[] = $this->hydratePlaceType($it->next());
    }
    return $ret;
  }

  /**
   * Hydrates a Place object from an associative array
   *
   * @param array $t
   * @return Place an hydrated place
   */
  protected function hydratePlace($t)
  {
    $p = new Place();
    $p->id = $t['id'];
    $p->name = $t['name'];
    $p->description = $t['description'];
    $p->link = $t['link'];
    $p->lat = $t['lat'];
    $p->lng = $t['lng'];
    $p->placeTypeId = $t['place_type_id'];

    if(isset($t['place_type_name']) && isset($t['place_type_label']))
    {
      $pt = new PlaceType();
      $pt->id = $t['place_type_id'];
      $pt->label = $t['place_type_label'];
      $pt->name = $t['place_type_name'];
      $p->type = $pt;
    }
    return $p;
  }

  /**
   * Hydrates a PlaceType object from an associative array
   *
   * @param array $t
   * @return PlaceType an hydrated place
   */
  protected function hydratePlaceType($t)
  {
    $p = new PlaceType();
    $p->id = $t['id'];
    $p->label = $t['label'];
    $p->name = $t['name'];
    return $p;
  }
}
