import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Catalog extends Model {
	static table = 'catalog';

	@field('name') name;

	@field('content') content;
}
