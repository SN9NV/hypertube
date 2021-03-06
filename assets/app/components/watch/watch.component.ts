import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {MovieService} from '../../services/movies.service';
import {isNullOrUndefined} from "util";

@Component({
	selector: 'hypertube-watch',
	templateUrl: './watch.component.html',
	styleUrls: ['./watch.component.css']
})
export class WatchComponent {
	private subscription: Subscription;
	movie: any = {
		poster: '',
		src: null
	};
	captions: any[] = [];
	noMovie: boolean = false;

	constructor(private activatedRoute: ActivatedRoute, private _movieService: MovieService) {
	}

	ngOnInit() {
		// subscribe to router event
		this.subscription = this.activatedRoute.params.subscribe(
			(param: any) => {
				this._movieService.findBySlug(param.name)
					.then(watch => {
						console.log(watch);
						if (isNullOrUndefined(watch)) {
							return this.noMovie = true;
						}
						this.movie = {
							poster: watch.backdrop_path,
							src: `/api/watch/${watch.torrents[0].hash}`,
						};
						this._movieService.getCaptions(watch.yify_id)
							.then(captions => {
								this.captions = captions;
								console.log(captions);
							});
					})
					.catch(err => console.log(err));
			});
	}

	ngOnDestroy() {
		// prevent memory leak by unsubscribing
		this.subscription.unsubscribe();
	}
}