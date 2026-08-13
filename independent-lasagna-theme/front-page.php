<?php
/**
 * Home page template.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<section class="hero hero--home">
	<div class="container hero__inner il-fade">
		<span class="eyebrow"><?php esc_html_e( 'Food & Lifestyle Entertainment', 'independent-lasagna' ); ?></span>
		<h1><?php esc_html_e( 'A social production company, making it independent.', 'independent-lasagna' ); ?></h1>
		<p class="hero__lede"><?php esc_html_e( 'Video production, web & social, feature films, wedding films, and original series — built by a crew of filmmakers who believe in doing it together.', 'independent-lasagna' ); ?></p>
		<div class="button-row">
			<a class="button button--gold" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'See Our Work', 'independent-lasagna' ); ?></a>
			<a class="button button--outline" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container statement il-fade">
		<span class="eyebrow"><?php esc_html_e( 'Do It Together', 'independent-lasagna' ); ?></span>
		<h2><?php esc_html_e( 'High quality content shouldn’t be out of reach.', 'independent-lasagna' ); ?></h2>
		<p><?php esc_html_e( 'Independent Lasagna Productions was founded by filmmakers who wanted financially feasible, high-quality media for small businesses, couples, and independent creators alike — from commercials and websites to weddings and feature films. We call it a Do It Together Creative Collective: creatives and businesses of every kind, working toward the same thing.', 'independent-lasagna' ); ?></p>
		<a class="link-arrow" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'More about us', 'independent-lasagna' ); ?></a>
	</div>
</section>

<section class="section section--dark">
	<div class="container">
		<div class="section-header il-fade">
			<span class="eyebrow"><?php esc_html_e( 'What We Do', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Production services for businesses, couples, and creators.', 'independent-lasagna' ); ?></h2>
		</div>
		<div class="grid grid--3">
			<?php
			$services = array(
				array( 'Video Production', 'Commercials, brand films, and video content shot and edited to actually get watched.' ),
				array( 'Web Design & Management', 'A stylish, personalized site — we’ll build it, host it, manage it, or teach you how.' ),
				array( 'Social Content & Management', 'Fun, clickable content for your platforms: videos, graphics, and campaigns that spread.' ),
				array( 'Graphic Design', 'Brand identity, print, and digital design that holds up next to the big budgets.' ),
				array( 'Sound Design & Music', 'Original composition and sound design built for picture, not stock-library filler.' ),
				array( 'Wedding Films', 'Documentary-style wedding coverage that plays back like a story, not a highlight reel.' ),
			);
			foreach ( $services as $i => $service ) :
				?>
				<article class="card il-fade" style="animation-delay:<?php echo esc_attr( $i * 70 ); ?>ms">
					<h3><?php echo esc_html( $service[0] ); ?></h3>
					<p><?php echo esc_html( $service[1] ); ?></p>
				</article>
				<?php
			endforeach;
			?>
		</div>
		<div class="section-footer il-fade">
			<a class="button button--outline" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'All Services', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container">
		<div class="section-header il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Featured Work', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Feature films, wedding films, and original series.', 'independent-lasagna' ); ?></h2>
		</div>
		<div class="grid grid--3">
			<?php
			$work_query = new WP_Query(
				array(
					'post_type'      => 'il_work',
					'posts_per_page' => 3,
					'no_found_rows'  => true,
				)
			);
			if ( $work_query->have_posts() ) :
				$i = 0;
				while ( $work_query->have_posts() ) :
					$work_query->the_post();
					il_work_card( get_the_ID(), $i * 70 );
					$i++;
				endwhile;
				wp_reset_postdata();
			else :
				$fallback = array(
					array( 'Feature Film', 'American Paradice' ),
					array( 'Feature Film', 'Odie' ),
					array( 'Original Series', 'Beyond the Check' ),
				);
				foreach ( $fallback as $i => $item ) :
					?>
					<article class="work-card il-fade" style="animation-delay:<?php echo esc_attr( $i * 70 ); ?>ms">
						<div class="work-card__media"><span class="work-card__media-placeholder" aria-hidden="true"></span></div>
						<div class="work-card__body">
							<span class="eyebrow"><?php echo esc_html( $item[0] ); ?></span>
							<h3><?php echo esc_html( $item[1] ); ?></h3>
						</div>
					</article>
					<?php
				endforeach;
				?>
				<p class="il-admin-note"><?php esc_html_e( 'Showing placeholder titles — add real entries under Work → Add New in wp-admin.', 'independent-lasagna' ); ?></p>
			<?php endif; ?>
		</div>
		<div class="section-footer il-fade">
			<a class="button button--outline" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'View All Work', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<section class="section section--dark">
	<div class="container">
		<div class="section-header il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Slices of Lasagna', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Latest from the News.', 'independent-lasagna' ); ?></h2>
		</div>
		<div class="grid grid--3">
			<?php
			$news_query = new WP_Query(
				array(
					'post_type'      => 'post',
					'posts_per_page' => 3,
					'no_found_rows'  => true,
				)
			);
			if ( $news_query->have_posts() ) :
				$i = 0;
				while ( $news_query->have_posts() ) :
					$news_query->the_post();
					?>
					<article class="card il-fade" style="animation-delay:<?php echo esc_attr( $i * 70 ); ?>ms">
						<span class="eyebrow"><?php echo esc_html( get_the_date() ); ?></span>
						<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 18 ) ); ?></p>
					</article>
					<?php
					$i++;
				endwhile;
				wp_reset_postdata();
			else :
				?>
				<p class="il-admin-note"><?php esc_html_e( 'No posts yet — published posts will appear here automatically.', 'independent-lasagna' ); ?></p>
				<?php
			endif;
			?>
		</div>
		<div class="section-footer il-fade">
			<a class="button button--outline" href="<?php echo esc_url( home_url( '/news/' ) ); ?>"><?php esc_html_e( 'Read the News', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<section class="section cta-band">
	<div class="container statement il-fade">
		<h2><?php esc_html_e( 'Have a project? Let’s make something together.', 'independent-lasagna' ); ?></h2>
		<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', 'independent-lasagna' ); ?></a>
	</div>
</section>

<?php get_footer(); ?>
